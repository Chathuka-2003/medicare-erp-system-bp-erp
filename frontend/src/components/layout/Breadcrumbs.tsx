"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

export function Breadcrumbs() {
  const pathname = usePathname();
  if (pathname === "/" || pathname === "/dashboard") return null;

  const paths = pathname.split("/").filter(Boolean);

  return (
    <nav className="flex items-center space-x-1.5 text-xs sm:text-sm text-muted-foreground" aria-label="Breadcrumb">
      <Link href="/dashboard" className="flex items-center gap-1 hover:text-primary transition-colors">
        <Home className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Dashboard</span>
      </Link>
      {paths.map((path, idx) => {
        const href = `/${paths.slice(0, idx + 1).join("/")}`;
        const isLast = idx === paths.length - 1;
        const label = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, " ");

        // Ignore dynamic IDs in breadcrumbs
        const isId = /^[0-9a-fA-F-]{36}$/.test(path) || /^\d+$/.test(path);
        const displayLabel = isId ? "Details" : label;

        return (
          <div key={href} className="flex items-center space-x-1.5">
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40 shrink-0" />
            {isLast ? (
              <span className="font-semibold text-foreground truncate max-w-[120px] sm:max-w-[200px]" aria-current="page">
                {displayLabel}
              </span>
            ) : (
              <Link href={href} className="hover:text-primary transition-colors truncate max-w-[120px] sm:max-w-[200px]">
                {displayLabel}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
