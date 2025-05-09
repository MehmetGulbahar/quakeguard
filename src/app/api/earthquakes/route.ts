import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { NextRequest } from 'next/server';
import { Earthquake } from '@/types/earthquake';

interface KandilliEarthquake {
  date: string;
  time: string;
  latitude: string;
  longitude: string;
  depth: string;
  md: string;
  ml: string;
  mw: string;
  location: string;
  quality: string;
}

interface AfadEarthquake {
  eventID: string;
  date: string;
  magnitude: number;
  depth: number;
  latitude: number;
  longitude: number;
  location: string;
  province: string;
  district: string;
  neighborhood?: string;
}

interface USGSFeature {
  type: string;
  properties: {
    mag: number;
    place: string;
    time: number;
    updated: number;
    url: string;
    detail: string;
    status: string;
    tsunami: number;
    magType: string;
    type: string;
    title: string;
  };
  geometry: {
    type: string;
    coordinates: [number, number, number];
  };
  id: string;
}

interface USGSResponse {
  type: string;
  metadata: {
    generated: number;
    url: string;
    title: string;
    status: number;
    api: string;
    limit: number;
    offset: number;
    count: number;
  };
  features: USGSFeature[];
}

interface GeofonEarthquake {
  eventId: string;
  time: string;
  latitude: string;
  longitude: string;
  depth: string;
  magType: string;
  magnitude: string;
  location: string;
}

interface EMSCFeature {
  type: string;
  geometry: {
    type: string;
    coordinates: number[];
  };
  id: string;
  properties: {
    source_id: string;
    source_catalog: string;
    lastupdate: string;
    time: string;
    flynn_region: string;
    lat: number;
    lon: number;
    depth: number;
    evtype: string;
    auth: string;
    mag: number;
    magtype: string;
    unid: string;
  };
}

interface EMSCResponse {
  type: string;
  metadata: {
    count: number;
  };
  features: EMSCFeature[];
}

function turkishCharFix(text: string): string {
  return text
    .replace(/Ý/g, 'İ')
    .replace(/Ð/g, 'Ğ')
    .replace(/Þ/g, 'Ş')
    .replace(/þ/g, 'ş')
    .replace(/ð/g, 'ğ')
    .replace(/ý/g, 'ı')
    .replace(/Ýlksel/g, 'İlksel');
}

async function scrapeKandilliData(): Promise<KandilliEarthquake[]> {
  try {
    const response = await fetch('http://www.koeri.boun.edu.tr/scripts/lst8.asp');
    const buffer = await response.arrayBuffer();
    const decoder = new TextDecoder('latin1');
    const html = decoder.decode(buffer);

    const $ = cheerio.load(html);
    const preText = $('pre').text();
    const lines = preText.split('\n').slice(6); 

    const earthquakes: KandilliEarthquake[] = [];

    lines.forEach(line => {
      if (!line.trim()) return;

      const segments = line.trim().split(/\s+/);
      if (segments.length < 9) return;

      const locationEndIndex = segments.length - 1;
      const location = turkishCharFix(segments.slice(8, locationEndIndex).join(' '));

      earthquakes.push({
        date: segments[0],
        time: segments[1],
        latitude: segments[2],
        longitude: segments[3],
        depth: segments[4],
        md: segments[5],
        ml: segments[6],
        mw: segments[7],
        location: location,
        quality: segments[segments.length - 1]
      });
    });

    return earthquakes;
  } catch (error) {
    console.error('Kandilli scraping error:', error);
    throw error;
  }
}

async function getAfadData(): Promise<AfadEarthquake[]> {
  try {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);
    
    const startDateStr = startDate.toISOString().slice(0, 19).replace('T', ' ');
    const endDateStr = endDate.toISOString().slice(0, 19).replace('T', ' ');
    const startEncoded = encodeURIComponent(startDateStr);
    const endEncoded = encodeURIComponent(endDateStr);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    
    const response = await fetch(
      `https://servisnet.afad.gov.tr/apigateway/deprem/apiv2/event/filter?start=${startEncoded}&end=${endEncoded}&orderby=timedesc`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Origin': 'https://quakeguard.vercel.app',
        },
        cache: 'no-store',
        next: { revalidate: 0 },
        signal: controller.signal
      }
    );
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.error(`AFAD API returned status ${response.status}`);
      return [];
    }

    const data = await response.json();
    
    if (!Array.isArray(data)) {
      console.error('AFAD data is not an array:', data);
      return [];
    }

    return data.map((item: any): AfadEarthquake => ({
      eventID: item.eventID || String(item.id),
      date: item.date,
      magnitude: Number(item.magnitude),
      depth: Number(item.depth),
      latitude: Number(item.latitude),
      longitude: Number(item.longitude),
      location: item.location,
      province: item.province,
      district: item.district,
      neighborhood: item.neighborhood || undefined
    }));

  } catch (error) {
    console.error('AFAD error:', error);
    return [];
  }
}

async function getUSGSData(): Promise<USGSFeature[]> {
  try {
    const response = await fetch(
      'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&orderby=time&limit=20',
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
        next: { revalidate: 0 }
      }
    );

    const data: USGSResponse = await response.json();
    
    if (!data.features || !Array.isArray(data.features)) {
      console.error('USGS data is not in expected format:', data);
      return [];
    }

    return data.features;

  } catch (error) {
    console.error('USGS API error:', error);
    return [];
  }
}

async function getGeofonData(): Promise<GeofonEarthquake[]> {
  try {
    const response = await fetch(
      'https://geofon.gfz.de/fdsnws/event/1/query?format=text&limit=15&orderby=time',
      {
        method: 'GET',
        headers: {
          'Accept': 'text/plain',
        },
        cache: 'no-store',
        next: { revalidate: 0 }
      }
    );

    if (!response.ok) {
      console.error(`GEOFON API returned status ${response.status}`);
      return [];
    }

    const text = await response.text();
    const lines = text.split('\n');
    
    // İlk satır header, onu atlayalım
    const dataLines = lines.filter(line => line.trim() && !line.startsWith('#'));
    
    const earthquakes: GeofonEarthquake[] = [];
    
    for (const line of dataLines) {
      const parts = line.split('|');
      if (parts.length >= 14) {
        earthquakes.push({
          eventId: parts[0],
          time: parts[1],
          latitude: parts[2],
          longitude: parts[3],
          depth: parts[4],
          magType: parts[9],
          magnitude: parts[10],
          location: parts[12]
        });
      }
    }
    
    return earthquakes;
  } catch (error) {
    console.error('GEOFON API error:', error);
    return [];
  }
}

async function getEMSCData(): Promise<EMSCFeature[]> {
  try {
    const response = await fetch(
      'https://www.seismicportal.eu/fdsnws/event/1/query?format=json&minlatitude=35.0&maxlatitude=43.0&minlongitude=25.0&maxlongitude=45.0&orderby=time&limit=20',
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
        next: { revalidate: 0 }
      }
    );

    if (!response.ok) {
      console.error(`EMSC API returned status ${response.status}`);
      return [];
    }

    const data: EMSCResponse = await response.json();
    
    if (!data.features || !Array.isArray(data.features)) {
      console.error('EMSC data is not in expected format:', data);
      return [];
    }

    return data.features;

  } catch (error) {
    console.error('EMSC API error:', error);
    return [];
  }
}

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const source = searchParams.get('source') || 'all';
    let earthquakes: Earthquake[] = [];

    if (source === 'all') {
      console.log('Fetching data from all sources...');
      
      let kandilliData: KandilliEarthquake[] = [];
      let afadData: AfadEarthquake[] = [];
      let usgsData: USGSFeature[] = [];
      let geofonData: GeofonEarthquake[] = [];
      let emscData: EMSCFeature[] = [];
      
      try {
        kandilliData = await scrapeKandilliData();
        console.log(`Kandilli data fetched: ${kandilliData.length} records`);
      } catch (error) {
        console.error('Failed to fetch Kandilli data:', error);
      }
      
      try {
        usgsData = await getUSGSData();
        console.log(`USGS data fetched: ${usgsData.length} records`);
      } catch (error) {
        console.error('Failed to fetch USGS data:', error);
      }
      
      try {
        afadData = await getAfadData();
        console.log(`AFAD data fetched: ${afadData.length} records`);
      } catch (error) {
        console.error('Failed to fetch AFAD data:', error);
      }

      try {
        geofonData = await getGeofonData();
        console.log(`GEOFON data fetched: ${geofonData.length} records`);
      } catch (error) {
        console.error('Failed to fetch GEOFON data:', error);
      }

      try {
        emscData = await getEMSCData();
        console.log(`EMSC data fetched: ${emscData.length} records`);
      } catch (error) {
        console.error('Failed to fetch EMSC data:', error);
      }

      const formattedKandilliData = kandilliData.map((eq): Earthquake => ({
        id: `kandilli-${eq.date}-${eq.time}`,
        date: new Date(`${eq.date} ${eq.time} GMT+0300`),
        magnitude: parseFloat(eq.ml) || parseFloat(eq.mw) || parseFloat(eq.md) || 0,
        depth: parseFloat(eq.depth),
        latitude: parseFloat(eq.latitude),
        longitude: parseFloat(eq.longitude),
        location: eq.location,
        source: 'Kandilli',
        province: eq.location.split('-')[0]?.trim() || '',
        district: eq.location.split('-')[1]?.trim() || '',
        quality: eq.quality
      }));

      const formattedAfadData = afadData.map((eq): Earthquake => ({
        id: eq.eventID,
        date: new Date(eq.date),
        magnitude: eq.magnitude,
        depth: eq.depth,
        latitude: eq.latitude,
        longitude: eq.longitude,
        location: eq.location,
        source: 'AFAD',
        province: eq.province,
        district: eq.district,
        neighborhood: eq.neighborhood
      }));
      
      const formattedUSGSData = usgsData.map((feature): Earthquake => ({
        id: feature.id,
        date: new Date(feature.properties.time),
        magnitude: feature.properties.mag,
        depth: feature.geometry.coordinates[2], 
        latitude: feature.geometry.coordinates[1],
        longitude: feature.geometry.coordinates[0],
        location: feature.properties.place,
        source: 'USGS',
        province: feature.properties.place.split(' of ')[1] || '',
        district: '',
      }));

      const formattedGeofonData = geofonData.map((eq): Earthquake => ({
        id: eq.eventId,
        date: new Date(eq.time),
        magnitude: parseFloat(eq.magnitude),
        depth: parseFloat(eq.depth),
        latitude: parseFloat(eq.latitude),
        longitude: parseFloat(eq.longitude),
        location: eq.location,
        source: 'GEOFON',
        province: eq.location.split('-')[0]?.trim() || '',
        district: eq.location.split('-')[1]?.trim() || '',
      }));

      const formattedEMSCData = emscData.map((feature): Earthquake => ({
        id: feature.id,
        date: new Date(feature.properties.time),
        magnitude: feature.properties.mag,
        depth: Math.abs(feature.geometry.coordinates[2]), // Mutlak değer alarak negatif değerleri pozitife çeviriyorum
        latitude: feature.properties.lat,
        longitude: feature.properties.lon,
        location: feature.properties.flynn_region || 'Unknown Location',
        source: 'EMSC',
        province: feature.properties.flynn_region?.split(' ')[0] || '',
        district: '',
      }));

      earthquakes = [...formattedKandilliData, ...formattedAfadData, ...formattedUSGSData, ...formattedGeofonData, ...formattedEMSCData];
      
      earthquakes.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (source === 'kandilli') {
      const kandilliData = await scrapeKandilliData();
      earthquakes = kandilliData.map((eq): Earthquake => ({
        id: `kandilli-${eq.date}-${eq.time}`,
        date: new Date(`${eq.date} ${eq.time} GMT+0300`),
        magnitude: parseFloat(eq.ml) || parseFloat(eq.mw) || parseFloat(eq.md) || 0,
        depth: parseFloat(eq.depth),
        latitude: parseFloat(eq.latitude),
        longitude: parseFloat(eq.longitude),
        location: eq.location,
        source: 'Kandilli',
        province: eq.location.split('-')[0]?.trim() || '',
        district: eq.location.split('-')[1]?.trim() || '',
        quality: eq.quality
      }));
    } else if (source === 'afad') {
      const afadData = await getAfadData();
      earthquakes = afadData.map((eq): Earthquake => ({
        id: eq.eventID,
        date: new Date(eq.date),
        magnitude: eq.magnitude,
        depth: eq.depth,
        latitude: eq.latitude,
        longitude: eq.longitude,
        location: eq.location,
        source: 'AFAD',
        province: eq.province,
        district: eq.district,
        neighborhood: eq.neighborhood
      }));
    } else if (source === 'usgs') {
      const usgsData = await getUSGSData();
      earthquakes = usgsData.map((feature): Earthquake => ({
        id: feature.id,
        date: new Date(feature.properties.time),
        magnitude: feature.properties.mag,
        depth: feature.geometry.coordinates[2],
        latitude: feature.geometry.coordinates[1],
        longitude: feature.geometry.coordinates[0],
        location: feature.properties.place,
        source: 'USGS',
        province: feature.properties.place.split(' of ')[1] || '',
        district: '',
      }));
    } else if (source === 'geofon') {
      const geofonData = await getGeofonData();
      earthquakes = geofonData.map((eq): Earthquake => ({
        id: eq.eventId,
        date: new Date(eq.time),
        magnitude: parseFloat(eq.magnitude),
        depth: parseFloat(eq.depth),
        latitude: parseFloat(eq.latitude),
        longitude: parseFloat(eq.longitude),
        location: eq.location,
        source: 'GEOFON',
        province: eq.location.split('-')[0]?.trim() || '',
        district: eq.location.split('-')[1]?.trim() || '',
      }));
    } else if (source === 'emsc') {
      const emscData = await getEMSCData();
      earthquakes = emscData.map((feature): Earthquake => ({
        id: feature.id,
        date: new Date(feature.properties.time),
        magnitude: feature.properties.mag,
        depth: Math.abs(feature.geometry.coordinates[2]), // Mutlak değer alarak negatif değerleri pozitife çeviriyorum
        latitude: feature.properties.lat, // properties.lat kullanıyoruz
        longitude: feature.properties.lon, // properties.lon kullanıyoruz
        location: feature.properties.flynn_region || 'Unknown Location',
        source: 'EMSC',
        province: feature.properties.flynn_region?.split(' ')[0] || '',
        district: '',
      }));
    }

    return NextResponse.json(earthquakes);
  } catch (error) {
    console.error('Error in GET route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch earthquakes' },
      { status: 500 }
    );
  }
}