"use client"

import { useQuery } from "@tanstack/react-query"
import { getEarthquakes } from "@/services/api"
import { format } from "date-fns"
import { tr } from "date-fns/locale"
import { MapPin, Activity, ArrowRight, Waves, Ruler } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface LatestEarthquakeCardsProps {
  displayCount?: number
}

export function LatestEarthquakeCards({ displayCount = 1 }: LatestEarthquakeCardsProps) {
  const { data: earthquakes, isLoading } = useQuery({
    queryKey: ["earthquakes", "all"],
    queryFn: () => getEarthquakes("all"),
    refetchInterval: 5 * 60 * 1000,
  })

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-muted rounded w-24" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-2/3" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const afadEarthquakes = earthquakes?.filter(eq => eq.source === 'AFAD') || []
  const kandilliEarthquakes = earthquakes?.filter(eq => eq.source === 'Kandilli') || []

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* AFAD Sütunu */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">AFAD Son Depremler</h2>
        {afadEarthquakes.slice(0, displayCount).map((earthquake, index) => (
          earthquake && (
            <Card 
              key={index} 
              className={cn(
                "relative overflow-hidden group transition-all duration-300 hover:shadow-lg",
                "before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-r",
                "before:from-secondary/10 before:to-transparent hover:before:from-secondary/20"
              )}
            >
              <div className={cn(
                "absolute top-4 right-4 px-3 py-1 text-xs font-semibold rounded-full",
                "flex items-center gap-1.5 transition-transform group-hover:scale-105",
                "bg-secondary/10 text-secondary"
              )}>
                <Activity className="w-3 h-3" />
                {earthquake.source}
              </div>

              <CardHeader>
                <CardTitle className="flex items-start gap-3">
                  <div className="mt-1">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="leading-tight">{earthquake.location}</h3>
                    <p className="text-sm font-normal text-muted-foreground">
                      {earthquake.province}, {earthquake.district}
                      {earthquake.neighborhood && `, ${earthquake.neighborhood}`}
                    </p>
                  </div>
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "p-2 rounded-lg",
                        earthquake.magnitude >= 4 ? "bg-destructive/10" : 
                        earthquake.magnitude >= 3 ? "bg-warning/10" : 
                        "bg-primary/10"
                      )}>
                        <Waves className={cn(
                          "w-4 h-4",
                          earthquake.magnitude >= 4 ? "text-destructive" : 
                          earthquake.magnitude >= 3 ? "text-warning" : 
                          "text-primary"
                        )} />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Büyüklük</p>
                        <p className={cn(
                          "text-2xl font-bold",
                          earthquake.magnitude >= 4 ? "text-destructive" : 
                          earthquake.magnitude >= 3 ? "text-warning" : 
                          "text-primary"
                        )}>
                          {earthquake.magnitude.toFixed(1)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-muted">
                        <Ruler className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Derinlik</p>
                        <p className="text-2xl font-bold text-muted-foreground">
                          {earthquake.depth.toFixed(1)}
                          <span className="text-sm ml-1">km</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(earthquake.date), "d MMMM yyyy HH:mm", {
                        locale: tr,
                      })}
                    </p>
                    {earthquake.quality && (
                      <span className="text-xs px-2 py-1 rounded-full bg-muted">
                        {earthquake.quality.replace('Ýlksel', 'İlksel')}
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>

              <div className={cn(
                "absolute bottom-0 left-0 right-0 h-1",
                "bg-secondary",
                "opacity-30 group-hover:opacity-50 transition-opacity"
              )} />
            </Card>
          )
        ))}
      </div>

      {/* Kandilli Sütunu */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Kandilli Son Depremler</h2>
        {kandilliEarthquakes.slice(0, displayCount).map((earthquake, index) => (
          earthquake && (
            <Card 
              key={index} 
              className={cn(
                "relative overflow-hidden group transition-all duration-300 hover:shadow-lg",
                "before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-r",
                "before:from-primary/10 before:to-transparent hover:before:from-primary/20"
              )}
            >
              <div className={cn(
                "absolute top-4 right-4 px-3 py-1 text-xs font-semibold rounded-full",
                "flex items-center gap-1.5 transition-transform group-hover:scale-105",
                "bg-primary/10 text-primary"
              )}>
                <Activity className="w-3 h-3" />
                {earthquake.source}
              </div>

              <CardHeader>
                <CardTitle className="flex items-start gap-3">
                  <div className="mt-1">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="leading-tight">{earthquake.location}</h3>
                    <p className="text-sm font-normal text-muted-foreground">
                      {earthquake.province}, {earthquake.district}
                      {earthquake.neighborhood && `, ${earthquake.neighborhood}`}
                    </p>
                  </div>
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "p-2 rounded-lg",
                        earthquake.magnitude >= 4 ? "bg-destructive/10" : 
                        earthquake.magnitude >= 3 ? "bg-warning/10" : 
                        "bg-primary/10"
                      )}>
                        <Waves className={cn(
                          "w-4 h-4",
                          earthquake.magnitude >= 4 ? "text-destructive" : 
                          earthquake.magnitude >= 3 ? "text-warning" : 
                          "text-primary"
                        )} />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Büyüklük</p>
                        <p className={cn(
                          "text-2xl font-bold",
                          earthquake.magnitude >= 4 ? "text-destructive" : 
                          earthquake.magnitude >= 3 ? "text-warning" : 
                          "text-primary"
                        )}>
                          {earthquake.magnitude.toFixed(1)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-muted">
                        <Ruler className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Derinlik</p>
                        <p className="text-2xl font-bold text-muted-foreground">
                          {earthquake.depth.toFixed(1)}
                          <span className="text-sm ml-1">km</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(earthquake.date), "d MMMM yyyy HH:mm", {
                        locale: tr,
                      })}
                    </p>
                    {earthquake.quality && (
                      <span className="text-xs px-2 py-1 rounded-full bg-muted">
                        {earthquake.quality.replace('Ýlksel', 'İlksel')}
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>

              <div className={cn(
                "absolute bottom-0 left-0 right-0 h-1",
                "bg-primary",
                "opacity-30 group-hover:opacity-50 transition-opacity"
              )} />
            </Card>
          )
        ))}
      </div>
    </div>
  )
} 