"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Check, Copy, Download, ExternalLink, QrCode } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type BusinessQrCardProps = {
  businessId: string;
  businessName: string;
};

export function BusinessQrCard({
  businessId,
  businessName,
}: BusinessQrCardProps) {
  const [feedbackUrl, setFeedbackUrl] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!businessId) return;

    let mounted = true;
    const id = setTimeout(() => {
      const url = `${window.location.origin}/f/${businessId}`;

      if (!mounted) return;

      setFeedbackUrl(url);

      QRCode.toDataURL(url, {
        width: 600,
        margin: 2,
        errorCorrectionLevel: "M",
      })
        .then((data) => {
          if (mounted) setQrDataUrl(data);
        })
        .catch(() => {
          if (mounted) setError(true);
        });
    }, 0);

    return () => {
      mounted = false;
      clearTimeout(id);
    };
  }, [businessId]);

  async function handleCopy() {
    if (!feedbackUrl) return;

    try {
      await navigator.clipboard.writeText(feedbackUrl);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      // Clipboard may be unavailable in some browser contexts.
    }
  }

  function handleDownload() {
    if (!qrDataUrl) return;

    const link = document.createElement("a");

    link.href = qrDataUrl;
    link.download = `${toFileName(businessName)}-feedback-qr.png`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function handleOpenFeedbackPage() {
    if (!feedbackUrl) return;

    window.open(feedbackUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)] p-2">
      <Card>
        <CardHeader>
          <CardTitle>Customer feedback QR</CardTitle>
          <CardDescription>
            Display this QR code where customers can easily scan it.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="mx-auto flex max-w-md flex-col items-center rounded-xl border bg-background p-6 text-center sm:p-8">
            <p className="text-sm font-medium text-muted-foreground">
              {businessName}
            </p>

            <h2 className="mt-2 text-xl font-semibold">
              How was your experience?
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Scan to share your feedback
            </p>

            <div className="my-6 flex size-64 items-center justify-center rounded-xl bg-white p-3">
              {error ? (
                <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
                  <QrCode className="size-8" />
                  Couldn&apos;t generate QR code
                </div>
              ) : qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt={`Feedback QR code for ${businessName}`}
                  className="size-full"
                />
              ) : (
                <div className="size-48 animate-pulse rounded-lg bg-muted" />
              )}
            </div>

            <p className="text-xs font-medium tracking-wide text-muted-foreground">
              Powered by Expulse
            </p>
          </div>

          <div className="mt-6 flex justify-center">
            <Button
              type="button"
              onClick={handleDownload}
              disabled={!qrDataUrl}
            >
              <Download className="size-4" />
              Download QR
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="h-fit">
        <CardHeader>
          <CardTitle>Feedback link</CardTitle>
          <CardDescription>
            Share this link directly or use it to test your feedback page.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="rounded-lg border bg-muted/40 p-3">
            <p className="break-all text-sm text-muted-foreground">
              {feedbackUrl || "Preparing feedback link..."}
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row lg:flex-col xl:flex-row">
            <Button
              type="button"
              variant="outline"
              onClick={handleCopy}
              disabled={!feedbackUrl}
            >
              {copied ? (
                <Check className="size-4" />
              ) : (
                <Copy className="size-4" />
              )}

              {copied ? "Copied" : "Copy link"}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleOpenFeedbackPage}
              disabled={!feedbackUrl}
            >
              <ExternalLink className="size-4" />
              Open feedback page
            </Button>
          </div>

          <div className="border-t pt-4">
            <p className="text-sm font-medium">Where to display it</p>

            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Place the QR somewhere customers naturally see it after their
              experience, such as a counter, table, receipt area, or checkout
              point.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function toFileName(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
