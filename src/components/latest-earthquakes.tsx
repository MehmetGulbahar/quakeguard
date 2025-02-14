"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { getEarthquakes } from "@/services/api"
import { Earthquake } from "@/types/earthquake"
import { format } from "date-fns"
import { tr } from "date-fns/locale"
import { MapPin, Activity, Waves, Ruler, Map } from "lucide-react"
import { SourceSelector } from "./source-selector"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function LatestEarthquakes() {
  const router = useRouter()
  const [selectedSource, setSelectedSource] = useState('kandilli')
  
  const { data: earthquakes, isLoading } = useQuery({
    queryKey: ["earthquakes", selectedSource],
    queryFn: () => getEarthquakes(selectedSource),
    refetchInterval: 5 * 60 * 1000,
  })

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-xl sm:text-2xl font-semibold">Son Depremler</h2>
          <SourceSelector 
            selectedSource={selectedSource}
            onSourceChange={setSelectedSource}
          />
        </div>
        <div className="grid gap-4">
          {[...Array(5)].map((_, i) => (
            <Card key={`loading-${i}`} className="animate-pulse">
              <div className="p-4">
                <div className="h-6 bg-muted rounded w-24 mb-4" />
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-full" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const sortedEarthquakes = earthquakes?.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  const handleMapClick = (earthquake: Earthquake) => {
    router.push(`/map?lat=${earthquake.latitude}&lng=${earthquake.longitude}&zoom=9&id=${earthquake.id}`)
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl sm:text-2xl font-semibold">Son Depremler</h2>
        <SourceSelector 
          selectedSource={selectedSource}
          onSourceChange={setSelectedSource}
        />
      </div>
      <div className="grid gap-4">
        {sortedEarthquakes?.slice(0, 10).map((earthquake) => {
          const uniqueKey = `${earthquake.source}-${earthquake.id}-${new Date(earthquake.date).getTime()}`
          return (
            <Card 
              key={uniqueKey}
              className={cn(
                "relative overflow-hidden group transition-all duration-300 hover:shadow-lg",
                "before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-r",
                earthquake.source === 'Kandilli' 
                  ? "before:from-primary/5 before:to-transparent hover:before:from-primary/10"
                  : "before:from-secondary/5 before:to-transparent hover:before:from-secondary/10"
              )}
            >
              <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:grid sm:grid-cols-[1fr,auto] gap-4 sm:gap-6">
                  <div className="flex items-start sm:items-center gap-3">
                    <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground shrink-0 mt-1 sm:mt-0" />
                    <div className="min-w-0">
                      <p className="text-base sm:text-lg font-medium line-clamp-1">{earthquake.location}</p>
                      <p className="text-sm sm:text-base text-muted-foreground truncate">
                        {earthquake.province}, {earthquake.district}
                        {earthquake.neighborhood && `, ${earthquake.neighborhood}`}
                      </p>
                    </div>
                  </div>
                  <div className={cn(
                    "px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base font-medium rounded-full w-fit",
                    "flex items-center gap-2",
                    earthquake.source === 'Kandilli' ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary"
                  )}>
                    <Activity className="w-4 h-4 sm:w-5 sm:h-5" />
                    {earthquake.source}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-[auto,1fr,auto] gap-4 sm:gap-8 mt-4 sm:mt-6">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "p-2 sm:p-3 rounded-xl",
                      earthquake.magnitude >= 4 ? "bg-destructive/10" : 
                      earthquake.magnitude >= 3 ? "bg-warning/10" : 
                      "bg-primary/10"
                    )}>
                      <Waves className={cn(
                        "w-5 h-5 sm:w-6 sm:h-6",
                        earthquake.magnitude >= 4 ? "text-destructive" : 
                        earthquake.magnitude >= 3 ? "text-warning" : 
                        "text-primary"
                      )} />
                    </div>
                    <div>
                      <p className={cn(
                        "text-2xl sm:text-3xl font-bold leading-none",
                        earthquake.magnitude >= 4 ? "text-destructive" : 
                        earthquake.magnitude >= 3 ? "text-warning" : 
                        "text-primary"
                      )}>
                        {earthquake.magnitude.toFixed(1)}
                      </p>
                      <p className="text-sm sm:text-base text-muted-foreground mt-1">Büyüklük</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 justify-end sm:justify-center">
                    <div className="p-2 sm:p-3 rounded-xl bg-muted">
                      <Ruler className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-2xl sm:text-3xl font-bold leading-none">
                        {earthquake.depth.toFixed(1)}
                        <span className="text-sm sm:text-base ml-1">km</span>
                      </p>
                      <p className="text-sm sm:text-base text-muted-foreground mt-1">Derinlik</p>
                    </div>
                  </div>

                  <div className="col-span-2 sm:col-span-1 text-left sm:text-right mt-2 sm:mt-0 sm:self-center">
                    <p className="text-lg sm:text-xl font-medium">
                      {format(new Date(earthquake.date), "HH:mm", { locale: tr })}
                    </p>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      {format(new Date(earthquake.date), "d MMM yyyy", { locale: tr })}
                    </p>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
                  onClick={() => handleMapClick(earthquake)}
                >
                  <Map className="w-5 h-5" />
                  <span className="sr-only">Haritada göster</span>
                </Button>
              </div>

              <div className={cn(
                "absolute bottom-0 left-0 right-0 h-1",
                earthquake.source === 'Kandilli' ? "bg-primary" : "bg-secondary",
                "opacity-30 group-hover:opacity-50 transition-opacity"
              )} />
            </Card>
          )
        })}
      </div>
    </div>
  )
} 