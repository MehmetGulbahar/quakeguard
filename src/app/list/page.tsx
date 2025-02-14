"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { getEarthquakes } from "@/services/api"
import { LatestEarthquakeCards } from "@/components/latest-earthquake-cards"

export default function ListPage() {
  const [showMore, setShowMore] = useState(false)
  
  const { data: earthquakes, isLoading } = useQuery({
    queryKey: ["earthquakes", "all"],
    queryFn: () => getEarthquakes("all"),
    refetchInterval: 5 * 60 * 1000,
  })

  const displayCount = showMore ? 3 : 1

  if (isLoading) {
    return <div className="container py-4">Yükleniyor...</div>
  }

  return (
    <main className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Son Depremler</h1>
      <LatestEarthquakeCards displayCount={displayCount} />
      
      <div className="flex justify-center mt-6">
        <button
          onClick={() => setShowMore(!showMore)}
          className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          {showMore ? 'Daha Az Göster' : 'Daha Fazla Göster'}
        </button>
      </div>
    </main>
  )
} 