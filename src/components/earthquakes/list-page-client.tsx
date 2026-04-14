"use client";

import { useState } from "react";
import { LatestEarthquakeCards } from "@/components/home/latest-earthquake-cards";

export function ListPageClient() {
  const [showMore, setShowMore] = useState(false);
  const displayCount = showMore ? 3 : 1;

  return (
    <main className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Son Depremler</h1>
      <LatestEarthquakeCards displayCount={displayCount} />

      <div className="flex justify-center mt-6">
        <button
          onClick={() => setShowMore(!showMore)}
          className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          {showMore ? "Daha Az Göster" : "Daha Fazla Göster"}
        </button>
      </div>
    </main>
  );
}
