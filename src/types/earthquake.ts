export interface Earthquake {
  id: string;
  date: string | Date;
  magnitude: number;
  depth: number;
  latitude: number;
  longitude: number;
  location: string;
  source: 'Kandilli' | 'AFAD' | 'USGS' | 'GEOFON';
  province: string;
  district: string;
  neighborhood?: string;
  quality?: string;
}