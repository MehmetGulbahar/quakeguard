import { SITE_URL } from "@/lib/seo";
import { Earthquake } from "@/types/earthquake";

export async function fetchEarthquakes(source: string = "all"): Promise<Earthquake[]> {
  try {
    const response = await fetch(`${SITE_URL}/api/earthquakes?source=${source}`, {
      next: { revalidate: 120 },
    });

    if (!response.ok) {
      return [];
    }

    const data = (await response.json()) as Earthquake[];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function fetchEarthquakeById(id: string): Promise<Earthquake | null> {
  const earthquakes = await fetchEarthquakes("all");
  return earthquakes.find((earthquake) => earthquake.id === id) || null;
}

export function toIsoDate(dateValue: string | Date): string {
  return new Date(dateValue).toISOString();
}
