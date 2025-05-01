import { EarthquakeInfo } from "@/components/earthquakes/earthquake-info"

export default function InfoPage() {
  return (
    <main className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Deprem Bilgi Sistemi</h1>
      <EarthquakeInfo />
    </main>
  )
} 