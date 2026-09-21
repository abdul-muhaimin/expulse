"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Settings } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { navigationItems } from "@/lib/navigation";

export function DesktopSidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="
        sticky top-14 hidden
        h-[calc(100vh-3.5rem)]
        w-56 shrink-0
        border-r bg-background
        md:block
      "
    >
      <div className="flex h-full flex-col p-2">
        {/* Main navigation */}
        <nav className="space-y-0.5">
          {navigationItems.map((item) => {
            const Icon = item.icon;

            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.label}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  buttonVariants({
                    variant: isActive ? "secondary" : "ghost",
                  }),
                  "w-full justify-start",
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Settings stays at the bottom */}
        <div className="mt-auto">
          <Link
            href="/settings"
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "w-full justify-start",
            )}
          >
            <Settings className="size-4" />
            Settings
          </Link>
        </div>
      </div>
    </aside>
  );
}
