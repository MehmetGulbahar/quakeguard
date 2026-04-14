import { ThemeProvider } from "@/components/layout/theme-provider";
import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script"; 
import "./globals.css";
import { Footer } from "@/components/layout/footer";
import { QueryProvider } from "@/components/providers/query-provider";
import "leaflet/dist/leaflet.css"
import { PageTransition } from "@/components/layout/page-transition"
import { cn } from "@/lib/utils";
import { Analytics } from '@vercel/analytics/next';
import { Navbar } from "@/components/layout/navbar";
import { SpeedInsights } from '@vercel/speed-insights/next';
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_KEYWORDS,
  SITE_NAME,
  SITE_URL,
  createWebApplicationSchema,
  createWebSiteSchema,
} from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { PwaClient } from "@/components/pwa/pwa-client";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";



const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "QuakeGuard | Türkiye Canlı Deprem Takip Sistemi",
    template: "%s | QuakeGuard",
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: DEFAULT_KEYWORDS,
  category: "technology",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "QuakeGuard | Türkiye Canlı Deprem Takip Sistemi",
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "QuakeGuard | Türkiye Canlı Deprem Takip Sistemi",
    description: DEFAULT_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  appleWebApp: {
    capable: true,
    title: "QuakeGuard",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0f172a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const websiteSchema = createWebSiteSchema();
  const webApplicationSchema = createWebApplicationSchema();

  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <Script id="prevent-extensions" strategy="beforeInteractive">
          {`
            if (typeof window !== 'undefined') {
              // Tarayıcı eklentilerinin eklediği attribute'ların kaldırılması
              window.addEventListener('DOMContentLoaded', () => {
                const observer = new MutationObserver((mutations) => {
                  mutations.forEach((mutation) => {
                    if (mutation.attributeName && mutation.attributeName.startsWith('data-gr-')) {
                      document.body.removeAttribute(mutation.attributeName);
                    }
                  });
                });
                
                observer.observe(document.body, {
                  attributes: true,
                  childList: false,
                  subtree: false
                });
              });
            }
          `}
        </Script>
      </head>
      <body
        suppressHydrationWarning
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          plusJakarta.className
        )}
      >
        <JsonLd data={websiteSchema} />
        <JsonLd data={webApplicationSchema} />
         {/* Google Analytics Scripts */}
       <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-BEZ1W4JHK4"
       strategy="afterInteractive"
       />
       <Script id="google-analytics" strategy="afterInteractive">
               {`
           window.dataLayer = window.dataLayer || [];
           function gtag(){dataLayer.push(arguments);}
           gtag('js', new Date());
           gtag('config', 'G-BEZ1W4JHK4');
         `}
       </Script>     
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <div className="flex flex-col min-h-screen">
              <PwaClient />
              <Navbar />
              <main className="flex-grow pb-20 md:pb-0">
                <PageTransition>
                  {children}
                  <Analytics />
                </PageTransition>
               <SpeedInsights />
              </main>
              <Footer />
              <MobileBottomNav />
            </div>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
