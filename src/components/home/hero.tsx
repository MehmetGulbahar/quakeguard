import Link from "next/link";
import { Button } from "../ui/button";

export function Hero() {
  return (
    <section className="container flex flex-col items-center gap-6 pb-12 pt-10 md:py-16 bg-gradient-to-br from-blue-50 via-white to-purple-100 rounded-3xl shadow-xl">
      <h1 className="text-center text-3xl font-extrabold leading-tight tracking-tight md:text-6xl lg:leading-[1.1] bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent drop-shadow-md animate-fade-in">
        Deprem Bilgilendirme Sistemi
      </h1>
      <p className="max-w-[750px] text-center text-lg text-muted-foreground sm:text-xl font-medium animate-fade-in delay-100">
        Türkiye ve dünya genelindeki depremleri gerçek zamanlı olarak takip edin.
      </p>
      <div className="flex gap-4 mt-4 animate-fade-in delay-200">
        <Link href="/map">
          <Button size="lg" className="transition-transform duration-200 hover:scale-105 shadow-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white border-none">
            Haritayı Görüntüle
          </Button>
        </Link>
        <Link href="/list">
          <Button variant="outline" size="lg" className="transition-transform duration-200 hover:scale-105 shadow-md border-blue-300/60">
            Son Depremler
          </Button>
        </Link>
      </div>
    </section>
  );
} 