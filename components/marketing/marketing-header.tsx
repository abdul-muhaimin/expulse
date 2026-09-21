import Image from "next/image";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function MarketingHeader() {
  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
        {/* Expulse brand */}
        <Link
          href="/"
          className="flex items-center gap-2"
          aria-label="Expulse home"
        >
          <Image
            src="/icon.png"
            alt=""
            width={28}
            height={28}
            className="size-7 object-contain"
            priority
          />

          <span className="text-lg font-semibold tracking-tight">Expulse</span>
        </Link>

        <nav className="flex items-center gap-2">
          {/* Existing users */}
          <Link
            href="/login"
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
          >
            Log in
          </Link>

          {/* Main acquisition CTA */}
          <Link href="/signup" className={cn(buttonVariants({ size: "sm" }))}>
            Get started
          </Link>
        </nav>
      </div>
    </header>
  );
}
