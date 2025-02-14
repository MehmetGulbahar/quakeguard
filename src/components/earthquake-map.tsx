"use client"

import { useQuery } from "@tanstack/react-query"
import { getEarthquakes } from "@/services/api"
import dynamic from "next/dynamic"
import "leaflet/dist/leaflet.css"
import { useState, useEffect, useRef } from "react"
import type { Icon as LeafletIcon, Map as LeafletMap } from "leaflet"
import { format } from "date-fns"
import { tr } from "date-fns/locale"
import { SourceSelector } from "./source-selector"
import { useSearchParams } from "next/navigation"
import { Marker as LeafletMarker } from "leaflet"

// Leaflet bileşenlerini client-side'da yükle
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
)
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
)
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
)
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
)

// Farklı büyüklükler için marker ikonları
let markerIcons: Record<string, LeafletIcon>
if (typeof window !== "undefined") {
  const L = require("leaflet")
  markerIcons = {
    small: new L.Icon({
      iconUrl: '/images/marker-shadow.png',
      iconSize: [24, 24],
      iconAnchor: [12, 24],
      popupAnchor: [0, -24],
      shadowUrl: null
    }),
    large: new L.Icon({
      iconUrl: '/images/marker-icon.png',
      iconSize: [24, 24],
      iconAnchor: [12, 24],
      popupAnchor: [0, -24],
      shadowUrl: null
    })
  }
}

// Büyüklüğe göre ikon seçimi fonksiyonu
const getMarkerIcon = (magnitude: number) => {
  if (magnitude >= 4.0) return markerIcons.large
  return markerIcons.small
}

// Büyüklük kategorileri için renkler
const getMagnitudeColor = (magnitude: number) => {
  if (magnitude >= 4) return "destructive"
  if (magnitude >= 3) return "warning"
  return "primary"
}

export function EarthquakeMap() {
  const [selectedSource, setSelectedSource] = useState('all')
  const searchParams = useSearchParams()
  
  const lat = searchParams.get('lat')
  const lng = searchParams.get('lng')
  const zoom = searchParams.get('zoom')
  const selectedId = searchParams.get('id')

  const defaultCenter: [number, number] = [39.0, 35.0]
  const defaultZoom = 6

  const center: [number, number] = lat && lng 
    ? [parseFloat(lat), parseFloat(lng)]
    : defaultCenter

  const { data: earthquakes, isLoading } = useQuery({
    queryKey: ["earthquakes", selectedSource],
    queryFn: () => getEarthquakes(selectedSource),
    refetchInterval: 5 * 60 * 1000,
  })

  // Marker referanslarını tutmak için bir Map oluştur
  const markerRefs = useRef<Map<string, LeafletMarker>>(new Map())
  const mapRef = useRef<LeafletMap | null>(null)
  
  // selectedId değiştiğinde popup'ı aç
  useEffect(() => {
    if (selectedId && earthquakes && mapRef.current) {
      const selectedEarthquake = earthquakes.find(eq => eq.id === selectedId)
      if (selectedEarthquake) {
        const marker = markerRefs.current.get(selectedId)
        if (marker) {
          // Haritayı deprem konumuna merkezle ve popup'ı aç
          mapRef.current.setView(
            [selectedEarthquake.latitude, selectedEarthquake.longitude],
            8
          )
          marker.openPopup()
        }
      }
    }
  }, [selectedId, earthquakes])

  const renderLegend = () => (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-destructive" />
        <span className="text-sm">≥ 4.0</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-warning" />
        <span className="text-sm">3.0 - 3.9</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-primary" />
        <span className="text-sm">{"< 3.0"}</span>
      </div>
    </div>
  )

  if (isLoading || typeof window === "undefined") {
    return (
      <div className="space-y-4">
        <div className="flex justify-end">
          <SourceSelector 
            selectedSource={selectedSource}
            onSourceChange={setSelectedSource}
          />
        </div>
        <div className="h-[600px] w-full bg-muted animate-pulse rounded-lg" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        {renderLegend()}
        <SourceSelector 
          selectedSource={selectedSource}
          onSourceChange={setSelectedSource}
        />
      </div>
      <div className="h-[600px] w-full rounded-lg overflow-hidden border">
        <MapContainer
          center={center}
          zoom={zoom ? parseInt(zoom) : defaultZoom}
          className="h-full w-full"
          ref={mapRef}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {earthquakes?.map((earthquake) => {
            const markerColor = getMagnitudeColor(earthquake.magnitude)
            const uniqueKey = `${earthquake.source}-${earthquake.id}-${earthquake.date}`
            
            return (
              <Marker
                key={uniqueKey}
                position={[earthquake.latitude, earthquake.longitude]}
                icon={getMarkerIcon(earthquake.magnitude)}
                ref={(ref: any) => {
                  if (ref && ref.leafletElement) {
                    markerRefs.current.set(earthquake.id, ref.leafletElement)
                  }
                }}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-semibold">{earthquake.location}</h3>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(earthquake.date), "d MMMM yyyy HH:mm", {
                        locale: tr,
                      })}
                    </p>
                    <div className="mt-2">
                      <p className="text-sm">
                        Büyüklük:{" "}
                        <span className={`font-semibold text-${markerColor}`}>
                          {earthquake.magnitude.toFixed(1)}
                        </span>
                      </p>
                      <p className="text-sm">Derinlik: {earthquake.depth.toFixed(1)} km</p>
                    </div>
                    <p className="text-xs mt-1 text-muted-foreground">
                      Kaynak: {earthquake.source}
                    </p>
                    {earthquake.quality && (
                      <p className="text-xs text-muted-foreground">
                        Kalite: {earthquake.quality.replace('Ýlksel', 'İlksel')}
                      </p>
                    )}
                  </div>
                </Popup>
              </Marker>
            )
          })}
        </MapContainer>
      </div>
    </div>
  )
} 