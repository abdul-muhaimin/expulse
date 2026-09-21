import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function HeroSection() {
  return (
    <section className="border-b bg-background">
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24 lg:py-28">
        <div className="max-w-3xl">
          <Badge variant="secondary">Simple customer feedback</Badge>

          <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            Know what your customers really think.
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            Collect quick customer feedback, understand what needs improvement,
            and see whether customers would recommend your business.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/signup"
              className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto")}
            >
              Get started
              <ArrowRight className="size-4" />
            </Link>

            <a
              href="#how-it-works"
              className={cn(
                buttonVariants({
                  variant: "outline",
                  size: "lg",
                }),
                "w-full sm:w-auto",
              )}
            >
              See how it works
            </a>
          </div>

          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Check className="size-4 text-primary" />
              No customer login
            </span>

            <span className="flex items-center gap-1.5">
              <Check className="size-4 text-primary" />
              Takes seconds
            </span>

            <span className="flex items-center gap-1.5">
              <Check className="size-4 text-primary" />
              MVR 99/month
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
