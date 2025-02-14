import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import "leaflet/dist/leaflet.css"
import { PageTransition } from "@/components/page-transition"

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
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          suppressHydrationWarning
        >
          <QueryProvider>
            <Navbar />
            <PageTransition>
              {children}
            </PageTransition>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
