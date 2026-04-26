"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { DASHBOARD_TABS } from "@/lib/constants";

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-0 border-b border-black/10 mb-5">
      {DASHBOARD_TABS.map((tab) => {
        const isActive =
          tab.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(tab.href);

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "px-4 py-2.5 text-[13px] transition-colors relative",
              isActive
                ? "text-primary font-medium"
                : "text-neutral-secondary hover:text-neutral-text"
            )}
          >
            {tab.label}
            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
