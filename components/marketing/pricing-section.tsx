import Link from "next/link";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  "Customer feedback QR",
  "Experience tracking",
  "Recommendation score",
  "Customer comments",
  "Simple dashboard",
  "Monthly customer report",
];

export function PricingSection() {
  return (
    <section className="bg-muted/30 py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mx-auto max-w-xl text-center">
          <p className="text-sm font-medium text-primary">Simple pricing</p>

          <h2 className="mt-2 text-3xl font-semibold tracking-tight">
            One plan. Nothing complicated.
          </h2>
        </div>

        <Card className="mx-auto mt-10 max-w-md">
          <CardHeader>
            <CardTitle>Expulse</CardTitle>

            <div className="pt-3">
              <span className="text-4xl font-semibold tracking-tight">
                MVR 99
              </span>

              <span className="ml-1 text-muted-foreground">/ month</span>
            </div>
          </CardHeader>

          <CardContent>
            <div className="space-y-3">
              {features.map((feature) => (
                <div key={feature} className="flex items-center gap-2 text-sm">
                  <Check className="size-4 text-primary" />
                  {feature}
                </div>
              ))}
            </div>

            <Link
              href="/signup"
              className={cn(buttonVariants({ size: "lg" }), "mt-6 w-full")}
            >
              Get started
            </Link>

            <p className="mt-3 text-center text-xs text-muted-foreground">
              Payments will be introduced after the initial pilot.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
