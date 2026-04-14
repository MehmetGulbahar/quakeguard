import { EarthquakeInfo } from "@/components/earthquakes/earthquake-info"
import type { Metadata } from "next"
import { createPageMetadata } from "@/lib/seo"

export const metadata: Metadata = createPageMetadata({
  title: "Deprem Bilgi Merkezi | QuakeGuard",
  description:
    "Deprem öncesi hazırlık, deprem anı davranışı ve deprem sonrası güvenlik adımları için hızlı bilgi merkezi.",
  path: "/info",
  keywords: ["deprem anında ne yapılır", "acil deprem bilgisi"],
})

export default function InfoPage() {
  return (
    <main className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Deprem Bilgi Sistemi</h1>
      <EarthquakeInfo />
    </main>
  )
} 