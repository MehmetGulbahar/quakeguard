"use client"

import { Hero } from "@/components/hero";
import { LatestEarthquakes } from "@/components/latest-earthquakes";
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { getEarthquakes } from "@/services/api"
import { EarthquakeCard } from "@/components/earthquake-card"

export default function Home() {
  return (
    <main className="container py-4 space-y-4">
      <Hero />
      <LatestEarthquakes />
    </main>
  )
}
