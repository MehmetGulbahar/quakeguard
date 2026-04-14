import type { Metadata } from "next"
import { createPageMetadata } from "@/lib/seo"
import { ListPageClient } from "@/components/earthquakes/list-page-client"

export const metadata: Metadata = createPageMetadata({
  title: "Son Depremler Listesi | QuakeGuard",
  description:
    "Kandilli, AFAD ve küresel kaynaklardan güncellenen son deprem listesi. Türkiye için anlık deprem verilerini tek listede takip edin.",
  path: "/list",
  keywords: ["kandilli son depremler", "afad deprem listesi", "anlık deprem verileri"],
})

export default function ListPage() {
  return <ListPageClient />
} 