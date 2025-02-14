import { EarthquakeMap } from "@/components/earthquake-map"

export default function MapPage() {
  return (
    <main className="container py-8">
      <h1 className="text-2xl font-bold mb-4">Deprem Haritası</h1>
      <EarthquakeMap />
    </main>
  )
} 