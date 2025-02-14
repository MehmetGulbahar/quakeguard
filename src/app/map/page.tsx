import { Suspense } from "react"
import { EarthquakeMap } from "@/components/earthquake-map"

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