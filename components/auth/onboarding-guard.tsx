"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/auth/auth-provider";
import { useBusiness } from "@/components/business/business-provider";

export function OnboardingGuard({ children }: { children: ReactNode }) {
  const router = useRouter();

  const {
    user,
    loading: authLoading,
    isAdmin,
  } = useAuth();
  const { business, loading: businessLoading } = useBusiness();

  const loading = authLoading || businessLoading;

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    // Admin accounts don't go through business onboarding.
    if (isAdmin) {
      router.replace("/admin");
      return;
    }

    if (business?.status === "pending") {
      router.replace("/pending");
      return;
    }

    if (business?.status === "active") {
      router.replace("/dashboard");
      return;
    }

    if (business?.status === "suspended") {
      router.replace("/suspended");
    }
  }, [user, business, loading, isAdmin, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user || isAdmin || business) {
    return null;
  }

  return children;
}
