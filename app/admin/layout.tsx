import type { ReactNode } from "react";

import { RequireAdmin } from "@/components/auth/require-admin";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <RequireAdmin>
      <div className="min-h-screen bg-muted/30">{children}</div>
    </RequireAdmin>
  );
}
