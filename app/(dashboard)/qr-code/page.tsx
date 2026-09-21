"use client";

import { BusinessQrCard } from "@/components/qr/business-qr-card";
import { useBusiness } from "@/components/business/business-provider";

export default function QrPage() {
  const { business } = useBusiness();

  if (!business) {
    return null;
  }

  return (
    <div className="space-y-6 p-2">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight p-2">QR Code</h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Let customers quickly share their experience with your business.
        </p>
      </div>

      <BusinessQrCard businessId={business.id} businessName={business.name} />
    </div>
  );
}
