import type { ReactNode } from "react";

import { RequireActiveBusiness } from "@/components/auth/require-active-business";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <RequireActiveBusiness>
      <DashboardShell>{children}</DashboardShell>
    </RequireActiveBusiness>
  );
}
