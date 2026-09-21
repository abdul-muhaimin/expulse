"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/auth/auth-provider";

export function RequireAuth({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    // Only redirect after Firebase has finished checking
    // whether a saved session exists.
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  // Never render protected content while auth is unknown.
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  // Don't flash the dashboard before the redirect happens.
  if (!user) {
    return null;
  }

  return children;
}
