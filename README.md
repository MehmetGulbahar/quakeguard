# QuakeGuard - Deprem İzleme Sistemi

QuakeGuard, Türkiye'deki depremleri gerçek zamanlı olarak takip etmenizi sağlayan modern bir web uygulamasıdır. Kandilli Rasathanesi ve AFAD'dan alınan verileri birleştirerek kullanıcılara kapsamlı bir deprem izleme deneyimi sunar.

## Özellikler

- 🌍 **Gerçek Zamanlı Harita**: Depremleri interaktif harita üzerinde görüntüleme
- 📊 **Çoklu Veri Kaynağı**: Kandilli Rasathanesi ve AFAD verilerini tek platformda birleştirme
- 📱 **Mobil Uyumlu**: Responsive tasarım ile her cihazda sorunsuz çalışma
- 🌓 **Karanlık/Aydınlık Mod**: Göz yorgunluğunu azaltan tema seçenekleri
- ⚡ **Anlık Güncellemeler**: 5 dakikada bir otomatik veri güncelleme
- 🔍 **Detaylı Bilgi**: Her deprem için detaylı bilgi görüntüleme
- 📍 **Konum Bazlı**: Depremleri haritada konumlarıyla görüntüleme
- 🎯 **Filtreleme**: Kaynaklara göre deprem verilerini filtreleme

## Teknolojiler

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, Shadcn UI
- **Harita**: Leaflet
- **State Management**: React Query
- **Animations**: Framer Motion
- **Data Fetching**: Server-side ve Client-side fetching

## Başlangıç

Geliştirme sunucusunu başlatmak için:

```bash
# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev
# veya
yarn dev
# veya
pnpm dev
# veya
bun dev
```

[http://localhost:3000](http://localhost:3000) adresini tarayıcınızda açarak uygulamayı görüntüleyebilirsiniz.

## Kullanım

1. Ana sayfada son depremleri görüntüleyin
2. Harita görünümüne geçerek depremleri konumlarıyla birlikte inceleyin
3. Veri kaynağını Kandilli veya AFAD olarak filtreleyebilirsiniz
4. Her deprem kartındaki harita ikonuna tıklayarak ilgili depremi haritada görüntüleyin
5. Karanlık/aydınlık mod arasında geçiş yaparak kullanım deneyiminizi özelleştirin

## Daha Fazla Bilgi

Next.js hakkında daha fazla bilgi için:

- [Next.js Dokümantasyonu](https://nextjs.org/docs) - Next.js özellikleri ve API'si hakkında bilgi edinin.
- [Next.js Öğrenin](https://nextjs.org/learn) - İnteraktif Next.js eğitimi.

## Vercel'de Dağıtım

Next.js uygulamanızı dağıtmanın en kolay yolu, Next.js'in yaratıcılarından [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)'u kullanmaktır.

Daha fazla detay için [Next.js dağıtım dokümantasyonuna](https://nextjs.org/docs/app/building-your-application/deploying) göz atın.

## Katkıda Bulunma

1. Bu repoyu fork edin
2. Yeni bir branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'feat: Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Bir Pull Request oluşturun

