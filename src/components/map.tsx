"use client"

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import { Icon } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Earthquake } from "@/types/earthquake"
import L from 'leaflet'

L.Icon.Default.imagePath = ''
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/icons/shadowmarker.png',
  iconUrl: '/icons/shadowmarker.png',
  shadowUrl: ''
})

const MARKER_ICON = new Icon({
  iconUrl: '/icons/shadowmarker.png',  
  iconSize: [24, 24],                 
  iconAnchor: [12, 24],               
  popupAnchor: [0, -24]               
})

interface MapProps {
  earthquakes: Earthquake[]
}

export default function Map({ earthquakes }: MapProps) {
  return (
    <MapContainer
      center={[39.0, 35.0]}
      zoom={6}
      className="w-full h-[calc(100vh-4rem)]"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {earthquakes.map((earthquake) => (
        <Marker
          key={earthquake.id}
          position={[earthquake.latitude, earthquake.longitude]}
          icon={MARKER_ICON}
        >
          <Popup>
            <div className="flex flex-col gap-1">
              <span className="font-semibold">{earthquake.location}</span>
              <span>Büyüklük: {earthquake.magnitude}</span>
              <span>Derinlik: {earthquake.depth} km</span>
              <span>Tarih: {earthquake.date.toString()}</span>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
} 