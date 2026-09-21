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

  function handleDownloadQr() {
    if (!qrDataUrl) return;

    downloadDataUrl(
      qrDataUrl,
      `${toFileName(businessName)}-feedback-qr.png`,
    );
  }

  async function handleDownloadCard() {
    if (!qrDataUrl) return;

    const canvas = document.createElement("canvas");

    // High-resolution portrait card.
    // Roughly A5 proportions and suitable for printing.
    canvas.width = 1748;
    canvas.height = 2480;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    // Background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Outer border
    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 4;
    roundedRect(ctx, 80, 80, canvas.width - 160, canvas.height - 160, 40);
    ctx.stroke();

    // Business name
    ctx.fillStyle = "#52525b";
    ctx.font = "500 44px Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(businessName, canvas.width / 2, 300);

    // Main heading
    ctx.fillStyle = "#18181b";
    ctx.font = "700 82px Arial, sans-serif";
    ctx.fillText("How was your experience?", canvas.width / 2, 450);

    // Supporting text
    ctx.fillStyle = "#71717a";
    ctx.font = "400 42px Arial, sans-serif";
    ctx.fillText("Scan to share your feedback", canvas.width / 2, 540);

    // Load QR into an image
    const qrImage = new Image();

    await new Promise<void>((resolve, reject) => {
      qrImage.onload = () => resolve();
      qrImage.onerror = () => reject();
      qrImage.src = qrDataUrl;
    });

    // QR
    const qrSize = 1050;
    const qrX = (canvas.width - qrSize) / 2;
    const qrY = 700;

    ctx.drawImage(qrImage, qrX, qrY, qrSize, qrSize);

    // CTA under QR
    ctx.fillStyle = "#18181b";
    ctx.font = "600 48px Arial, sans-serif";
    ctx.fillText("Tell us how we did", canvas.width / 2, 1900);

    ctx.fillStyle = "#71717a";
    ctx.font = "400 36px Arial, sans-serif";
    ctx.fillText("It only takes a moment.", canvas.width / 2, 1960);

    // Expulse divider
    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.moveTo(500, 2130);
    ctx.lineTo(canvas.width - 500, 2130);
    ctx.stroke();

    // Branding
    ctx.fillStyle = "#71717a";
    ctx.font = "400 30px Arial, sans-serif";
    ctx.fillText("Powered by", canvas.width / 2, 2220);

    ctx.fillStyle = "#18181b";
    ctx.font = "700 52px Georgia, serif";
    ctx.fillText("expulse", canvas.width / 2, 2290);

    downloadDataUrl(
      canvas.toDataURL("image/png"),
      `${toFileName(businessName)}-feedback-card.png`,
    );
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

          <div className="mt-6 flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
            <Button
              type="button"
              onClick={handleDownloadCard}
              disabled={!qrDataUrl}
            >
              <Download className="size-4" />
              Download print card
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleDownloadQr}
              disabled={!qrDataUrl}
            >
              <Download className="size-4" />
              QR only
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

function downloadDataUrl(dataUrl: string, fileName: string) {
  const link = document.createElement("a");

  link.href = dataUrl;
  link.download = fileName;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, radius);
}
