"use client";

import { use, useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";

import { CustomerFeedbackForm } from "@/components/feedback/customer-feedback-form";
import { db } from "@/lib/firebase/client";

type Business = {
  id: string;
  name: string;
  category: string;
  location: string;
};

export default function PublicFeedbackPage({
  params,
}: {
  params: Promise<{ businessId: string }>;
}) {
  const { businessId } = use(params);

  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [notAvailable, setNotAvailable] = useState(false);

  useEffect(() => {
    async function loadBusiness() {
      try {
        const snapshot = await getDoc(doc(db, "businesses", businessId));

        if (!snapshot.exists()) {
          setNotAvailable(true);
          return;
        }

        const data = snapshot.data();

        // Extra UI check in addition to Firestore rules.
        if (data.status !== "active") {
          setNotAvailable(true);
          return;
        }

        setBusiness({
          id: snapshot.id,
          name: data.name,
          category: data.category,
          location: data.location,
        });
      } catch (error: unknown) {
        // Public visitors should not see the difference between a missing,
        // inaccessible, or inactive business. Firestore can return
        // `permission-denied` for documents that don't exist or are blocked
        // by security rules; treat that as "not available" and avoid noisy
        // console errors in development.
        let code: string | undefined;

        if (typeof error === "object" && error !== null && "code" in error) {
          const maybeCode = (error as { code?: unknown }).code;
          if (typeof maybeCode === "string") code = maybeCode;
        }

        if (code && code !== "permission-denied" && code !== "not-found") {
          console.error("Failed to load business:", error);
        }

        setNotAvailable(true);
      } finally {
        setLoading(false);
      }
    }

    void loadBusiness();
  }, [businessId]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </main>
    );
  }

  if (notAvailable || !business) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <div className="max-w-sm text-center">
          <h1 className="text-xl font-semibold">Feedback unavailable</h1>

          <p className="mt-2 text-sm text-muted-foreground">
            This feedback page is not currently available.
          </p>

          <p className="mt-8 text-xs text-muted-foreground">
            Powered by Expulse
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-muted/30 px-4 py-10">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="text-sm font-medium text-muted-foreground">
            {business.location}
          </p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight">
            {business.name}
          </h1>
        </div>

        <CustomerFeedbackForm business={business} />

        <p className="mt-8 text-center text-xs text-muted-foreground">
          Powered by Expulse
        </p>
      </div>
    </main>
  );
}
