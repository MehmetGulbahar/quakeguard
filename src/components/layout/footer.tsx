"use client"

import Link from "next/link";
import { Activity, Linkedin, Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t py-4 bg-background">
      <div className="container max-w-screen-xl flex items-center justify-between">
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
        </div>
      </div>
    </footer>
  );
}