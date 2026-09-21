"use client";

import { use, useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";

import { CustomerFeedbackForm } from "@/components/feedback/customer-feedback-form";
import { db } from "@/lib/firebase/client";
import {
  type SupportedLang,
  detectLang,
  getTranslations,
} from "@/lib/i18n/customer-feedback";

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

  const [lang, setLang] = useState<SupportedLang>("en");

  // Detect language after mount so it never causes a hydration mismatch.
  useEffect(() => {
    const id = setTimeout(() => {
      setLang(detectLang());
    }, 0);
    return () => clearTimeout(id);
  }, []);

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

  const t = getTranslations(lang);
  const dir = lang === "ar" ? "rtl" : "ltr";

  if (loading) {
    return (
      <main
        dir={dir}
        className="flex min-h-screen items-center justify-center px-4"
      >
        <p className="text-sm text-muted-foreground">{t.loading}</p>
      </main>
    );
  }

  if (notAvailable || !business) {
    return (
      <main
        dir={dir}
        className="flex min-h-screen items-center justify-center px-4"
      >
        <div className="max-w-sm text-center">
          <h1 className="text-xl font-semibold">{t.unavailableTitle}</h1>

          <p className="mt-2 text-sm text-muted-foreground">
            {t.unavailableMessage}
          </p>

          <p className="mt-8 text-xs text-muted-foreground">{t.poweredBy}</p>
        </div>
      </main>
    );
  }

  return (
    <main dir={dir} className="min-h-screen bg-muted/30 px-4 py-10">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="text-sm font-medium text-muted-foreground">
            {business.location}
          </p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight">
            {business.name}
          </h1>
        </div>

        <CustomerFeedbackForm business={business} lang={lang} />

        <p className="mt-8 text-center text-xs text-muted-foreground">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-medium text-foreground underline-offset-4 transition-colors hover:text-primary hover:underline"
          >
            {t.poweredBy}
          </a>
        </p>
      </div>
    </main>
  );
}
