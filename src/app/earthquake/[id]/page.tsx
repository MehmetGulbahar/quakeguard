import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/json-ld";
import { fetchEarthquakeById, toIsoDate } from "@/lib/earthquakes-server";
import {
  createBreadcrumbSchema,
  createDatasetSchema,
  createNewsArticleSchema,
  createPageMetadata,
} from "@/lib/seo";

type EarthquakeDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: EarthquakeDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const earthquake = await fetchEarthquakeById(id);

  if (!earthquake) {
    return createPageMetadata({
      title: "Deprem Detayı Bulunamadı",
      description: "İstenen deprem kaydı bulunamadı. Güncel deprem listesine geri dönebilirsiniz.",
      path: `/earthquake/${encodeURIComponent(id)}`,
    });
  }

  const provinceOrLocation = earthquake.province || earthquake.location;
  return createPageMetadata({
    title: `${earthquake.magnitude.toFixed(1)} Büyüklüğünde ${provinceOrLocation} Depremi`,
    description: `${provinceOrLocation} bölgesindeki ${earthquake.magnitude.toFixed(1)} büyüklüğündeki depremin saat, derinlik, konum ve kaynak bilgileri.`,
    path: `/earthquake/${encodeURIComponent(id)}`,
    keywords: [
      `${provinceOrLocation} deprem`,
      "latest earthquake turkey",
      "real-time earthquake alerts",
    ],
  });
}

export default async function EarthquakeDetailPage({ params }: EarthquakeDetailPageProps) {
  const { id } = await params;
  const earthquake = await fetchEarthquakeById(id);

  if (!earthquake) {
    notFound();
  }

  const isoDate = toIsoDate(earthquake.date);
  const title = `${earthquake.magnitude.toFixed(1)} Büyüklüğünde ${earthquake.province || earthquake.location} Depremi`;

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "Ana Sayfa", path: "/" },
    { name: "Son Depremler", path: "/list" },
    { name: "Deprem Detayı", path: `/earthquake/${encodeURIComponent(id)}` },
  ]);

  const datasetSchema = createDatasetSchema({
    name: `${title} Veri Seti`,
    description: `${earthquake.location} için büyüklük, derinlik ve koordinat verileri`,
    path: `/earthquake/${encodeURIComponent(id)}`,
  });

  const newsSchema = createNewsArticleSchema({
    headline: title,
    description: `${earthquake.location} için doğrulanmış deprem detayları ve canlı harita bağlantısı.`,
    path: `/earthquake/${encodeURIComponent(id)}`,
    datePublished: isoDate,
    dateModified: isoDate,
  });

  return (
    <main className="container py-8 space-y-6">
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={datasetSchema} />
      <JsonLd data={newsSchema} />

      <header className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">
          Son güncelleme: {new Date(earthquake.date).toLocaleString("tr-TR", { timeZone: "Europe/Istanbul" })}
        </p>
      </header>

      <section aria-labelledby="deprem-detaylari" className="rounded-lg border p-5 space-y-2">
        <h2 id="deprem-detaylari" className="text-xl font-semibold">Deprem Detayları</h2>
        <p><strong>Konum:</strong> {earthquake.location}</p>
        <p><strong>İl:</strong> {earthquake.province || "Bilinmiyor"}</p>
        <p><strong>İlçe:</strong> {earthquake.district || "Bilinmiyor"}</p>
        <p><strong>Büyüklük:</strong> {earthquake.magnitude.toFixed(1)}</p>
        <p><strong>Derinlik:</strong> {earthquake.depth.toFixed(1)} km</p>
        <p><strong>Koordinatlar:</strong> {earthquake.latitude}, {earthquake.longitude}</p>
        <p><strong>Kaynak:</strong> {earthquake.source}</p>
      </section>

      <section aria-labelledby="hizli-sorular" className="space-y-2">
        <h2 id="hizli-sorular" className="text-2xl font-semibold">AI Arama İçin Hızlı Yanıtlar</h2>
        <p className="text-muted-foreground">Son deprem nerede oldu? Bu sayfadaki konum ve saat bilgisi güncel veriye dayanır.</p>
        <p className="text-muted-foreground">Deprem kaç büyüklüğünde oldu? Büyüklük değeri doğrudan kaynak kurumlardan alınır.</p>
      </section>

      <nav aria-label="Deprem detay bağlantıları" className="flex flex-wrap gap-3 text-sm">
        <Link className="underline underline-offset-4" href="/list">Son depremler listesine dön</Link>
        <Link
          className="underline underline-offset-4"
          href={`/map?lat=${earthquake.latitude}&lng=${earthquake.longitude}&zoom=8&id=${encodeURIComponent(earthquake.id)}`}
        >
          Haritada depremi aç
        </Link>
      </nav>
    </main>
  );
}
