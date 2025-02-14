import axios from 'axios';
import { Earthquake } from '@/types/earthquake';

interface AFADEarthquake {
  eventID: string;
  location: string;
  latitude: string;
  longitude: string;
  depth: string;
  type: string;
  magnitude: string;
  country: string;
  province: string;
  district: string;
  neighborhood: string | null;
  date: string;
  isEventUpdate: boolean;
  lastUpdateDate: string | null;
}

// Relative URL kullanarak Vercel'de sorunsuz çalışacak
const api = axios.create({
  baseURL: '/api',
});

export const getEarthquakes = async (source: string = 'all'): Promise<Earthquake[]> => {
  try {
    const response = await api.get<Earthquake[]>('/earthquakes', {
      params: { source }
    });

    // Tarihe göre sırala
    return response.data.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  } catch (error) {
    console.error('Error fetching earthquakes:', error);
    return [];
  }
};

export const getEarthquakeById = async (id: string): Promise<Earthquake> => {
  const response = await api.get<AFADEarthquake>(`/earthquakes/${id}`);
  const item = response.data;
  
  return {
    id: item.eventID,
    date: new Date(item.date),
    magnitude: parseFloat(item.magnitude),
    depth: parseFloat(item.depth),
    latitude: parseFloat(item.latitude),
    longitude: parseFloat(item.longitude),
    location: item.location,
    source: 'AFAD',
    province: item.province,
    district: item.district,
    neighborhood: item.neighborhood || undefined
  };
}; 