import { AdminLogoutButton } from "@/components/admin/admin-logout-button";
import { BusinessList } from "@/components/admin/business-list";

export default function AdminPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Expulse Admin
          </p>

          <h1 className="mt-1 text-3xl font-semibold tracking-tight">
            Businesses
          </h1>

          <p className="mt-2 text-muted-foreground">
            Review and manage businesses using Expulse.
          </p>
        </div>

        <AdminLogoutButton />
      </div>

      <BusinessList />
    </main>
  );
}
