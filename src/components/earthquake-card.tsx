"use client"

import { Earthquake } from "@/types/earthquake"
import { formatInTimeZone } from "date-fns-tz"
import { tr } from "date-fns/locale"
import Link from "next/link"

interface EarthquakeCardProps {
  earthquake: Earthquake
}

export function EarthquakeCard({ earthquake }: EarthquakeCardProps) {
  return (
    <Link 
      href={`/map?id=${earthquake.id}&lat=${earthquake.latitude}&lng=${earthquake.longitude}&zoom=8`}
      className="block p-4 mb-2 border rounded-lg hover:bg-muted/50"
    >
      <h3 className="font-semibold">{earthquake.location}</h3>
      <p className="text-sm text-muted-foreground">
        {formatInTimeZone(
          new Date(earthquake.date),
          'Europe/Istanbul',
          "d MMMM yyyy HH:mm",
          { locale: tr }
        )}
      </p>
      <div className="mt-2">
        <p className="text-sm">
          Büyüklük: <span className="font-semibold">{earthquake.magnitude.toFixed(1)}</span>
        </p>
        <p className="text-sm">Derinlik: {earthquake.depth.toFixed(1)} km</p>
      </div>
    </Link>
  )
} 