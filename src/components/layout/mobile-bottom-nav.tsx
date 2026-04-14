"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, Info, List, Map } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/", label: "Ana Sayfa", icon: Activity },
  { href: "/list", label: "Liste", icon: List },
  { href: "/map", label: "Harita", icon: Map },
  { href: "/info", label: "Acil", icon: Info },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="safe-bottom fixed inset-x-0 bottom-0 z-50 border-t bg-background/95 backdrop-blur md:hidden" aria-label="Mobil gezinme">
      <ul className="grid h-16 grid-cols-4">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex h-full flex-col items-center justify-center gap-1 text-xs",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
