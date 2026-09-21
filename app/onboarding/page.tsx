import Link from "next/link";

import { OnboardingGuard } from "@/components/auth/onboarding-guard";
import { BusinessOnboardingForm } from "@/components/onboarding/business-onboarding-form";

export default function OnboardingPage() {
  return (
    <OnboardingGuard>
      <main className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-10">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <Link href="/" className="text-xl font-semibold tracking-tight">
              expulse
            </Link>

            <h1 className="mt-6 text-2xl font-semibold tracking-tight">
              Set up your business
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              Tell us about your business before you start collecting customer
              feedback.
            </p>
          </div>

          <BusinessOnboardingForm />
        </div>
      </main>
    </OnboardingGuard>
  );
}
