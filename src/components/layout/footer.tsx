"use client"

import Link from "next/link";
import { Activity, Linkedin, Github, Globe } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t py-4 bg-background">
      <div className="container max-w-screen-xl space-y-4">
        <nav aria-label="Yerel deprem bağlantıları" className="flex flex-wrap items-center gap-4 text-sm text-foreground/70">
          <Link href="/earthquakes/izmir" className="hover:text-foreground transition-colors">İzmir deprem</Link>
          <Link href="/earthquakes/istanbul" className="hover:text-foreground transition-colors">İstanbul deprem</Link>
          <Link href="/earthquakes/ankara" className="hover:text-foreground transition-colors">Ankara deprem</Link>
          <Link href="/earthquakes/ege-bolgesi" className="hover:text-foreground transition-colors">Ege Bölgesi deprem</Link>
          <Link href="/earthquakes/marmara-bolgesi" className="hover:text-foreground transition-colors">Marmara Bölgesi deprem</Link>
        </nav>
        <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Activity className="h-5 w-5" />
          <span className="text-sm font-medium">
            QuakeGuard © {new Date().getFullYear()}
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <Link 
            href="https://www.linkedin.com/in/mehmetgulbahar/" 
            target="_blank"
            className="flex items-center space-x-1 text-sm text-foreground/60 hover:text-foreground transition-colors"
          >
            <Linkedin className="h-4 w-4" />
            <span>Mehmet Gulbahar</span>
          </Link>
          <Link 
            href="https://mehmetgulbahar.com/" 
            target="_blank"
            className="flex items-center space-x-1 text-sm text-foreground/60 hover:text-foreground transition-colors"
          >
            <Globe className="h-4 w-4" />
            <span>Website</span>
          </Link>
        </div>
        </div>
      </div>
    </footer>
  );
}