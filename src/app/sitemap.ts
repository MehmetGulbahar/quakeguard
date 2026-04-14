import type { MetadataRoute } from "next";
import { REGION_SEO_ENTRIES, SITE_URL } from "@/lib/seo";

type EarthquakeItem = { id: string };

async function getDynamicEarthquakeUrls(): Promise<MetadataRoute.Sitemap> {
  try {
    const response = await fetch(`${SITE_URL}/api/earthquakes?source=all`, {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return [];
    }

    const earthquakes = (await response.json()) as EarthquakeItem[];

    if (!Array.isArray(earthquakes)) {
      return [];
    }

    return earthquakes.slice(0, 250).map((earthquake) => ({
      url: `${SITE_URL}/earthquake/${encodeURIComponent(earthquake.id)}`,
      lastModified: new Date(),
      changeFrequency: "hourly" as const,
      priority: 0.7,
    }));
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/map`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/list`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/info`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    ...REGION_SEO_ENTRIES.map((region) => ({
      url: `${SITE_URL}/earthquakes/${region.slug}`,
      lastModified: new Date(),
      changeFrequency: "hourly" as const,
      priority: 0.8,
    })),
  ];

  const dynamicEarthquakePages = await getDynamicEarthquakeUrls();
  return [...staticPages, ...dynamicEarthquakePages];
}
