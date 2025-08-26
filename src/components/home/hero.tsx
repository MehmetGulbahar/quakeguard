import Link from "next/link";
import { Button } from "../ui/button";

export function Hero() {
  return (
    <section className="container py-12 md:py-20">
      <div className="mx-auto max-w-none text-center space-y-6">
        <h1 className="text-3xl font-bold tracking-tight md:text-5xl whitespace-nowrap">
          Deprem Bilgilendirme Sistemi
        </h1>
        <p className="mx-auto max-w-2xl text-lg sm:text-xl text-muted-foreground">
          Türkiye ve dünya genelindeki depremleri gerçek zamanlı olarak takip edin.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/map">
            <Button size="lg">
              Haritayı Görüntüle
            </Button>
          </Link>
          <Link href="/list">
            <Button variant="outline" size="lg">
              Son Depremler
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
} 