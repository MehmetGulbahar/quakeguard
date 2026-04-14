import type { Metadata } from "next"
import { Hero } from "@/components/home/hero"
import { LatestEarthquakes } from "@/components/earthquakes/latest-earthquakes"
import { SeoContentSections, homeFaqItems } from "@/components/home/seo-content"
import { JsonLd } from "@/components/seo/json-ld"
import {
  createBreadcrumbSchema,
  createDatasetSchema,
  createFaqSchema,
  createNewsArticleSchema,
  createPageMetadata,
} from "@/lib/seo"

export const metadata: Metadata = createPageMetadata({
  title: "QuakeGuard | Türkiye Canlı Deprem Takip Sistemi",
  description:
    "Türkiye ve dünya genelindeki son depremleri anlık olarak takip edin. İzmir, İstanbul ve tüm bölgeler için canlı deprem haritası ve gerçek zamanlı veriler.",
  path: "/",
  keywords: [
    "son deprem",
    "canlı deprem takibi",
    "türkiye deprem haritası",
    "az önce deprem oldu mu",
  ],
})

export default function Home() {
  const datasetSchema = createDatasetSchema({
    name: "QuakeGuard Canlı Deprem Veri Seti",
    description:
      "Türkiye ve dünya genelindeki son depremlerin gerçek zamanlı takip edildiği doğrulanmış deprem veri seti.",
    path: "/",
  })

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "Ana Sayfa", path: "/" },
  ])

  const faqSchema = createFaqSchema(
    homeFaqItems.map((item) => ({
      question: item.question,
      answer: item.answer,
    })),
  )

  const now = new Date().toISOString()
  const newsArticleSchema = createNewsArticleSchema({
    headline: "Türkiye Son Depremler Canlı Takip",
    description:
      "QuakeGuard ile Türkiye ve dünya genelindeki son deprem verilerini gerçek zamanlı izleyin.",
    path: "/",
    datePublished: now,
    dateModified: now,
  })

  return (
    <main className="container py-4 space-y-4">
      <JsonLd data={datasetSchema} />
      <JsonLd data={faqSchema} />
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={newsArticleSchema} />
      <Hero />
      <LatestEarthquakes />
      <SeoContentSections />
    </main>
  )
}
