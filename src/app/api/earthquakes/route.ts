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
    // Son 30 günlük deprem verilerini almak için tarih hesaplama
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    
    // ISO formatına çevirme ve URL kodlaması
    const startDateStr = startDate.toISOString().slice(0, 19).replace('T', ' ');
    const endDateStr = endDate.toISOString().slice(0, 19).replace('T', ' ');
    const startEncoded = encodeURIComponent(startDateStr);
    const endEncoded = encodeURIComponent(endDateStr);
    
    const response = await fetch(
      `https://servisnet.afad.gov.tr/apigateway/deprem/apiv2/event/filter?start=${startEncoded}&end=${endEncoded}&orderby=timedesc`,
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

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const source = searchParams.get('source') || 'all';
    let earthquakes: Earthquake[] = [];

    if (source === 'all') {
      console.log('Fetching data from all sources...');
      
      const [kandilliData, afadData, usgsData] = await Promise.all([
        scrapeKandilliData(),
        getAfadData(),
        getUSGSData()
      ]);

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

      earthquakes = [...formattedKandilliData, ...formattedAfadData, ...formattedUSGSData];
      
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