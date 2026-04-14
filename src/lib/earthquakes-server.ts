import { getEarthquakesData } from "@/app/api/earthquakes/route";
import { Earthquake } from "@/types/earthquake";

export async function fetchEarthquakes(source: string = "all"): Promise<Earthquake[]> {
  return getEarthquakesData(source);
}

export async function fetchEarthquakeById(id: string): Promise<Earthquake | null> {
  const earthquakes = await fetchEarthquakes("all");
  return earthquakes.find((earthquake) => earthquake.id === id) || null;
}

export function toIsoDate(dateValue: string | Date): string {
  return new Date(dateValue).toISOString();
}
