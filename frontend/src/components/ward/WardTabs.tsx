"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";

export function WardTabs() {
  const pathname = usePathname();

  const tabs = [
    { label: "Admissions", href: "/ward/admissions" },
    { label: "Beds Overview", href: "/ward/beds" },
    { label: "Wards", href: "/ward/wards" },
  ];

  return (
    <div className="flex border-b border-border/50 space-x-1">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href || pathname.startsWith(`${tab.href}/`);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "px-4 py-2.5 text-sm font-semibold border-b-2 -mb-[2px] transition-all duration-200",
              isActive
                ? "border-primary text-primary font-bold"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted"
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
