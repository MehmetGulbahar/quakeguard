import { EarthquakeMap } from "@/components/earthquakes/earthquake-map"
import { Suspense } from "react"
import type { Metadata } from "next"
import { createPageMetadata } from "@/lib/seo"

export const metadata: Metadata = createPageMetadata({
  title: "Türkiye Deprem Haritası | Canlı İzleme",
  description:
    "Türkiye deprem haritasını canlı izleyin. İzmir, İstanbul, Ankara ve çevresindeki son depremleri konum bazlı görüntüleyin.",
  path: "/map",
  keywords: ["türkiye deprem haritası", "live earthquake tracker", "turkey earthquake map"],
})

export default function MapPage() {
  return (
    <main className="container py-4">
      <Suspense fallback={
        <div className="h-[600px] w-full bg-muted animate-pulse rounded-lg" />
      }>
        <EarthquakeMap />
      </Suspense>
    </main>
  )
} 