import { HeroSection } from "@/components/marketing/hero-section";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { PricingSection } from "@/components/marketing/pricing-section";
import { ProductPreview } from "@/components/marketing/product-preview";

export default function HomePage() {
  return (
    <>
      <MarketingHeader />

      <main>
        <HeroSection />
        <HowItWorks />
        <ProductPreview />
        <PricingSection />
      </main>

      <MarketingFooter />
    </>
  );
}
