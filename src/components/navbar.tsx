"use client"

import Link from "next/link";
import { ModeToggle } from "./mode-toggle";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Activity } from "lucide-react";

const navItems = [
  {
    name: "Ana Sayfa",
    href: "/",
  },
  {
    name: "Deprem Haritası",
    href: "/map",
  },
  {
    name: "Son Depremler",
    href: "/list",
  },
  {
    name: "Bilgi",
    href: "/info",
  },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-xl items-center">
        <div className="flex flex-1 items-center justify-center">
          <Link href="/" className="mr-8 flex items-center space-x-2">
            <Activity className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">
              QuakeGuard
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className={cn(
                  "relative transition-colors hover:text-foreground/80",
                  pathname === item.href ? "text-foreground" : "text-foreground/60"
                )}
              >
                {pathname === item.href && (
                  <motion.div
                    layoutId="navbar-active"
                    className="absolute -bottom-[13px] h-0.5 w-full bg-foreground"
                    animate
                  />
                )}
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center justify-end space-x-4">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
} 