import { ThemeProvider } from "@/components/theme-provider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script"; // Script bileşenini import ediyoruz
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { QueryProvider } from "@/components/providers/query-provider";
import "leaflet/dist/leaflet.css"
import { PageTransition } from "@/components/page-transition"
import { cn } from "@/lib/utils";
import { Analytics } from '@vercel/analytics/next';


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "QuakeGuard - Deprem İzleme Sistemi",
  description: "Türkiye ve dünya genelindeki depremleri gerçek zamanlı takip edin.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <meta name="application-name" content="QuakeGuard" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="QuakeGuard" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#000000" />

        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Grammarly benzeri eklentilerin müdahalesini engellemek için script */}
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
          inter.className
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">
                <PageTransition>
                  {children}
                  <Analytics />

                </PageTransition>
              </main>
              <Footer />
            </div>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
