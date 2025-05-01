import { EarthquakeMap } from "@/components/earthquakes/earthquake-map"
import { Suspense } from "react"

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