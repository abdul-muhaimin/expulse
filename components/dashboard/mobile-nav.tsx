"use client";

import { usePathname } from "next/navigation";

import { navigationItems } from "@/lib/navigation";

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t bg-background md:hidden">
      <div className="grid h-16 grid-cols-4">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <button
              key={item.label}
              type="button"
              className={
                isActive
                  ? "flex flex-col items-center justify-center gap-1 text-primary"
                  : "flex flex-col items-center justify-center gap-1 text-muted-foreground"
              }
            >
              <Icon className="size-5" />
              <span className="text-[11px] font-medium">
                {item.shortLabel ?? item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
