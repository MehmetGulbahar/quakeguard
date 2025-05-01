import Link from "next/link";
import { Button } from "../ui/button";

export function Hero() {
  return (
    <section className="container flex flex-col items-center gap-4 pb-8 pt-6 md:py-10">
      <h1 className="text-center text-3xl font-bold leading-tight tracking-tighter md:text-6xl lg:leading-[1.1]">
        Deprem Bilgilendirme Sistemi
      </h1>
      <p className="max-w-[750px] text-center text-lg text-muted-foreground sm:text-xl">
        Türkiye ve dünya genelindeki depremleri gerçek zamanlı olarak takip edin.
      </p>
      <div className="flex gap-4">
        <Link href="/map">
          <Button size="lg">Haritayı Görüntüle</Button>
        </Link>
        <Link href="/list">
          <Button variant="outline" size="lg">
            Son Depremler
          </Button>
        </Link>
      </div>
    </section>
  );
} 