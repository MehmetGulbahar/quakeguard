import Link from "next/link";

const faqItems = [
  {
    question: "Son deprem nerede oldu?",
    answer:
      "Son deprem bilgisi QuakeGuard ana sayfasındaki canlı liste bölümünde dakika bazlı güncellenir. Konum, büyüklük ve derinlik değerleri kaynaklara göre doğrulanır.",
  },
  {
    question: "İzmir'de bugün deprem oldu mu?",
    answer:
      "İzmir deprem verilerini anlık filtreleyerek izlemek için İzmir sayfasını ve canlı deprem haritasını kullanabilirsiniz.",
  },
  {
    question: "Türkiye canlı deprem listesi nasıl takip edilir?",
    answer:
      "Kandilli, AFAD, USGS, GEOFON ve EMSC kaynakları bir araya getirilerek güncel Türkiye deprem listesi tek panelde sunulur.",
  },
];

export function SeoContentSections() {
  return (
    <div className="container space-y-10 py-6 md:py-10">
      <section aria-labelledby="canli-deprem-takibi" className="space-y-3">
        <h2 id="canli-deprem-takibi" className="text-2xl font-semibold tracking-tight">
          Canlı Deprem Takibi
        </h2>
        <p className="text-muted-foreground">
          QuakeGuard, Türkiye ve dünya genelindeki anlık deprem verilerini tek bir ekranda birleştirir.
          Son deprem, büyüklük ve derinlik bilgilerini mobil uyumlu arayüzde hızlıca görüntüleyebilirsiniz.
        </p>
      </section>

      <section aria-labelledby="yerel-deprem-sayfalari" className="space-y-3">
        <h2 id="yerel-deprem-sayfalari" className="text-2xl font-semibold tracking-tight">
          Yerel Deprem Sayfaları
        </h2>
        <p className="text-muted-foreground">
          İzmir deprem, İstanbul deprem ve Ankara deprem aramalarında daha hızlı bilgiye ulaşmak için
          şehir odaklı canlı listeleri kullanın.
        </p>
        <nav aria-label="Yerel deprem bağlantıları" className="flex flex-wrap gap-3">
          <Link href="/earthquakes/izmir" className="underline underline-offset-4">İzmir son depremler</Link>
          <Link href="/earthquakes/istanbul" className="underline underline-offset-4">İstanbul son depremler</Link>
          <Link href="/earthquakes/ankara" className="underline underline-offset-4">Ankara son depremler</Link>
          <Link href="/earthquakes/ege-bolgesi" className="underline underline-offset-4">Ege Bölgesi deprem takibi</Link>
          <Link href="/earthquakes/marmara-bolgesi" className="underline underline-offset-4">Marmara Bölgesi deprem takibi</Link>
        </nav>
      </section>

      <section aria-labelledby="acil-durum-bilgisi" className="space-y-3">
        <h2 id="acil-durum-bilgisi" className="text-2xl font-semibold tracking-tight">
          Deprem Anında Ne Yapmalı?
        </h2>
        <ul className="list-disc pl-5 text-muted-foreground space-y-1">
          <li>Çök-Kapan-Tutun hareketini uygulayın ve baş-boyun bölgenizi koruyun.</li>
          <li>Asansör kullanmayın, güvenli bir alanda artçı sarsıntılara karşı hazır olun.</li>
          <li>Resmi kurum duyurularını takip edin ve acil toplanma alanı bilginizi güncel tutun.</li>
        </ul>
      </section>

      <section aria-labelledby="sik-sorulan-sorular" className="space-y-3">
        <h2 id="sik-sorulan-sorular" className="text-2xl font-semibold tracking-tight">
          Sık Sorulan Sorular
        </h2>
        <div className="space-y-4">
          {faqItems.map((item) => (
            <article key={item.question} className="rounded-lg border p-4">
              <h3 className="font-medium">{item.question}</h3>
              <p className="mt-2 text-muted-foreground">{item.answer}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export const homeFaqItems = faqItems;
