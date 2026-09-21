import type { ReactNode } from "react";

import { AppHeader } from "./app-header";
import { DesktopSidebar } from "./desktop-sidebar";
import { MobileNav } from "./mobile-nav";

type DashboardShellProps = {
  children: ReactNode;
};

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-muted/30">
      <AppHeader />

      <div className="flex min-h-[calc(100vh-3.5rem)]">
        <DesktopSidebar />

        {/*
         * pb-20 gives mobile content enough space so the
         * fixed bottom navigation doesn't cover it.
         */}
        <main className="min-w-0 flex-1 pb-20 md:pb-0">{children}</main>
      </div>

      <MobileNav />
    </div>
  );
}
