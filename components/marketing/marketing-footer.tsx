import Image from "next/image";

export function MarketingFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between md:px-6">
        <div className="flex items-center gap-2">
          <Image
            src="/icon.png"
            alt=""
            width={24}
            height={24}
            className="size-6 object-contain"
          />

          <span className="font-semibold tracking-tight text-foreground">
            Expulse
          </span>
        </div>

        <span>Customer feedback made simple.</span>
      </div>
    </footer>
  );
}
