"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { getEarthquakes } from "@/services/api"
import { EarthquakeCard } from "@/components/earthquakes/earthquake-card"
import { Hero } from "@/components/home/hero"
import { LatestEarthquakes } from "@/components/earthquakes/latest-earthquakes"

export default function Home() {
  return (
    <main className="container py-4 space-y-4">
      <Hero />
      <LatestEarthquakes />
    </main>
  )
}
