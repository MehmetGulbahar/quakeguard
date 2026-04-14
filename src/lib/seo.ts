import type { Metadata } from "next";

const FALLBACK_URL = "https://quakeguard.vercel.app";

function normalizeUrl(url?: string): string {
  if (!url) {
    return FALLBACK_URL;
  }

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  return `https://${url}`;
}

export const SITE_NAME = "QuakeGuard";
export const SITE_URL = normalizeUrl(
  process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL || FALLBACK_URL,
);

export const DEFAULT_DESCRIPTION =
  "Türkiye ve dünya genelindeki son depremleri anlık takip edin. İzmir, İstanbul, Ankara ve tüm bölgeler için canlı deprem haritası ve gerçek zamanlı deprem verileri.";

export const DEFAULT_KEYWORDS = [
  "son deprem",
  "az önce deprem oldu mu",
  "izmir deprem",
  "türkiye deprem haritası",
  "canlı deprem takibi",
  "anlık deprem verileri",
  "kandilli son depremler",
  "afad deprem listesi",
  "latest earthquake turkey",
  "live earthquake tracker",
  "turkey earthquake map",
  "earthquake monitoring system",
  "real-time earthquake alerts",
];

export const PRIMARY_LOCALES = ["tr-TR", "en-US"];

export type RegionSeoEntry = {
  slug: string;
  title: string;
  keyword: string;
  shortDescription: string;
};

export const REGION_SEO_ENTRIES: RegionSeoEntry[] = [
  {
    slug: "izmir",
    title: "İzmir",
    keyword: "izmir deprem",
    shortDescription:
      "İzmir ve çevresindeki son depremleri canlı takip edin. Anlık büyüklük, derinlik ve konum bilgilerine ulaşın.",
  },
  {
    slug: "istanbul",
    title: "İstanbul",
    keyword: "istanbul deprem",
    shortDescription:
      "İstanbul son depremler listesi ve Marmara hattı sarsıntılarını gerçek zamanlı görüntüleyin.",
  },
  {
    slug: "ankara",
    title: "Ankara",
    keyword: "ankara deprem",
    shortDescription:
      "Ankara deprem verilerini güncel kaynaklardan toplayan canlı deprem takip ekranı.",
  },
  {
    slug: "ege-bolgesi",
    title: "Ege Bölgesi",
    keyword: "ege bölgesi deprem",
    shortDescription:
      "Ege Bölgesi deprem haritası, son sarsıntılar ve kritik büyüklük bilgileri tek ekranda.",
  },
  {
    slug: "marmara-bolgesi",
    title: "Marmara Bölgesi",
    keyword: "marmara bölgesi deprem",
    shortDescription:
      "Marmara Bölgesi canlı deprem verileri, fay hattı yakınındaki son hareketlilik ve harita görünümü.",
  },
  {
    slug: "turkey",
    title: "Türkiye",
    keyword: "türkiye deprem haritası",
    shortDescription:
      "Türkiye genelinde son depremleri anlık izleyin. Kandilli, AFAD ve küresel kaynaklarla doğrulanmış veri akışı.",
  },
];

export function getRegionSeoEntry(regionSlug: string): RegionSeoEntry | undefined {
  return REGION_SEO_ENTRIES.find((entry) => entry.slug === regionSlug);
}

export function toAbsoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function createPageMetadata({
  title,
  description,
  path,
  keywords,
}: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
}): Metadata {
  const absoluteUrl = toAbsoluteUrl(path);

  return {
    title,
    description,
    keywords: [...DEFAULT_KEYWORDS, ...(keywords || [])],
    alternates: {
      canonical: absoluteUrl,
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl,
      siteName: SITE_NAME,
      locale: "tr_TR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export function createWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: ["tr-TR", "en-US"],
    description: DEFAULT_DESCRIPTION,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/list?query={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function createWebApplicationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: SITE_NAME,
    url: SITE_URL,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    inLanguage: "tr-TR",
    browserRequirements: "Requires JavaScript",
    description: DEFAULT_DESCRIPTION,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "TRY",
    },
  };
}

export function createFaqSchema(items: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function createBreadcrumbSchema(
  items: Array<{ name: string; path: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: toAbsoluteUrl(item.path),
    })),
  };
}

export function createDatasetSchema({
  name,
  description,
  path,
}: {
  name: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name,
    description,
    url: toAbsoluteUrl(path),
    keywords: DEFAULT_KEYWORDS,
    inLanguage: "tr-TR",
    creator: {
      "@type": "Organization",
      name: SITE_NAME,
    },
    spatialCoverage: {
      "@type": "Place",
      name: "Türkiye ve Dünya",
    },
    distribution: [
      {
        "@type": "DataDownload",
        encodingFormat: "application/json",
        contentUrl: toAbsoluteUrl("/api/earthquakes?source=all"),
      },
    ],
  };
}

export function createNewsArticleSchema({
  headline,
  description,
  path,
  datePublished,
  dateModified,
}: {
  headline: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline,
    description,
    mainEntityOfPage: toAbsoluteUrl(path),
    datePublished,
    dateModified,
    inLanguage: "tr-TR",
    author: {
      "@type": "Organization",
      name: SITE_NAME,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
    },
  };
}
