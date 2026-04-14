import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cevrimdisi Mod",
  description: "Baglanti yokken QuakeGuard onbellekteki son deprem verilerini ve acil durum bilgilerini gostermeye devam eder.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function OfflinePage() {
  return (
    <main className="container py-16 text-center">
      <h1 className="text-3xl font-bold">Cevrimdisisiniz</h1>
      <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
        Baglanti geri gelene kadar son deprem verileri onbellekten gosterilir. Acil durum adimlari icin bilgi merkezini kullanabilirsiniz.
      </p>
      <div className="mt-8 flex items-center justify-center gap-4">
        <Link href="/list" className="rounded-md bg-primary px-4 py-2 text-primary-foreground">
          Son Depremler
        </Link>
        <Link href="/info" className="rounded-md border px-4 py-2">
          Acil Bilgi
        </Link>
      </div>
    </main>
  );
}
