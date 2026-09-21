"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Settings } from "lucide-react";

import { useAuth } from "@/components/auth/auth-provider";
import { navigationItems } from "@/lib/navigation";
import { cn } from "@/lib/utils";

import { buttonVariants, Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function DesktopSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();

  async function handleSignOut() {
    await signOut();
    router.replace("/login");
  }

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

        {/* Account area */}
        <div className="mt-auto">
          <Separator className="mb-2" />

          {/* Signed-in email */}
          <div className="px-3 py-2">
            <p className="text-xs text-muted-foreground">Signed in as</p>

            <p
              className="truncate text-sm font-medium"
              title={user?.email ?? undefined}
            >
              {user?.email ?? "Loading..."}
            </p>
          </div>

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

          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={handleSignOut}
          >
            <LogOut className="size-4" />
            Sign out
          </Button>
        </div>
      </div>
    </aside>
  );
}
