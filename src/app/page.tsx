import { Hero } from "@/components/hero";
import { LatestEarthquakes } from "@/components/latest-earthquakes";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <Hero />
      <LatestEarthquakes />
    </main>
  );
}
