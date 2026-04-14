import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/json-ld";
import { fetchEarthquakes } from "@/lib/earthquakes-server";
import {
  REGION_SEO_ENTRIES,
  createBreadcrumbSchema,
  createDatasetSchema,
  createNewsArticleSchema,
  createPageMetadata,
  getRegionSeoEntry,
} from "@/lib/seo";

type RegionPageProps = {
  params: Promise<{ region: string }>;
};

function normalizeForMatch(value: string): string {
  return value
    .toLocaleLowerCase("tr-TR")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/ı/g, "i");
}

export async function generateStaticParams() {
  return REGION_SEO_ENTRIES.map((entry) => ({ region: entry.slug }));
}

export async function generateMetadata({ params }: RegionPageProps): Promise<Metadata> {
  const { region } = await params;
  const regionEntry = getRegionSeoEntry(region);

  if (!regionEntry) {
    return createPageMetadata({
      title: "Bölgesel Deprem Takibi",
      description: "Bölgesel deprem verileri QuakeGuard canlı takip ekranında.",
      path: "/earthquakes",
    });
  }

  return createPageMetadata({
    title: `${regionEntry.title} Son Depremler | Canlı Takip`,
    description: regionEntry.shortDescription,
    path: `/earthquakes/${regionEntry.slug}`,
    keywords: [regionEntry.keyword, "canlı deprem listesi", "deprem takibi"],
  });
}

export default async function RegionPage({ params }: RegionPageProps) {
  const { region } = await params;
  const regionEntry = getRegionSeoEntry(region);

  if (!regionEntry) {
    notFound();
  }

  const earthquakes = await fetchEarthquakes("all");
  const regionNormalized = normalizeForMatch(regionEntry.title);

  const regionEarthquakes = earthquakes
    .filter((earthquake) => {
      const province = normalizeForMatch(earthquake.province || "");
      const district = normalizeForMatch(earthquake.district || "");
      const location = normalizeForMatch(earthquake.location || "");
      return (
        province.includes(regionNormalized) ||
        district.includes(regionNormalized) ||
        location.includes(regionNormalized)
      );
    })
    .slice(0, 20);

  const now = new Date().toISOString();
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "Ana Sayfa", path: "/" },
    { name: "Bölgesel Depremler", path: "/list" },
    { name: `${regionEntry.title} Son Depremler`, path: `/earthquakes/${regionEntry.slug}` },
  ]);

  const datasetSchema = createDatasetSchema({
    name: `${regionEntry.title} Deprem Veri Seti`,
    description: regionEntry.shortDescription,
    path: `/earthquakes/${regionEntry.slug}`,
  });

  const newsSchema = createNewsArticleSchema({
    headline: `${regionEntry.title} Son Depremler Canlı Takip`,
    description: regionEntry.shortDescription,
    path: `/earthquakes/${regionEntry.slug}`,
    datePublished: now,
    dateModified: now,
  });

  return (
    <main className="container py-8 space-y-6">
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={datasetSchema} />
      <JsonLd data={newsSchema} />

      <header className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight">{regionEntry.title} Son Depremler</h1>
        <p className="text-muted-foreground max-w-3xl">{regionEntry.shortDescription}</p>
        <p className="text-muted-foreground">
          Arama amacı: <strong>{regionEntry.keyword}</strong>
        </p>
      </header>

      <section aria-labelledby="liste" className="space-y-3">
        <h2 id="liste" className="text-2xl font-semibold">Canlı Bölgesel Deprem Listesi</h2>
        {regionEarthquakes.length === 0 ? (
          <p className="text-muted-foreground">Bu bölge için şu anda listelenecek deprem verisi bulunamadı.</p>
        ) : (
          <ul className="space-y-3">
            {regionEarthquakes.map((earthquake) => (
              <li key={`${earthquake.source}-${earthquake.id}`} className="rounded-lg border p-4">
                <p className="font-medium">{earthquake.location}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Büyüklük {earthquake.magnitude.toFixed(1)} | Derinlik {earthquake.depth.toFixed(1)} km | Kaynak {earthquake.source}
                </p>
                <div className="mt-2 flex gap-3 text-sm">
                  <Link className="underline underline-offset-4" href={`/earthquake/${encodeURIComponent(earthquake.id)}`}>
                    Detay sayfası
                  </Link>
                  <Link
                    className="underline underline-offset-4"
                    href={`/map?lat=${earthquake.latitude}&lng=${earthquake.longitude}&zoom=8&id=${encodeURIComponent(earthquake.id)}`}
                  >
                    Haritada göster
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="sge-answers" className="space-y-2">
        <h2 id="sge-answers" className="text-2xl font-semibold">Hızlı Yanıtlar</h2>
        <p className="text-muted-foreground">{regionEntry.title} bölgesinde bugün deprem olup olmadığını canlı listeden anlık kontrol edebilirsiniz.</p>
        <p className="text-muted-foreground">Büyüklük ve derinlik karşılaştırması için detay sayfalarını açın ve harita görünümüne geçin.</p>
      </section>
    </main>
  );
}
