import { LatestEarthquakeCards } from "@/components/latest-earthquake-cards"

export default function ListPage() {
  return (
    <main className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Son Depremler</h1>
      <LatestEarthquakeCards />
    </main>
  )
} 