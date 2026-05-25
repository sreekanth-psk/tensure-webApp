import { HeroSection } from "@/components/sections/hero";
import { AIEngineSection } from "@/components/sections/ai-engine";
import { TimelineSection } from "@/components/sections/timeline";
import { FeaturesSection } from "@/components/sections/features";
import { TrustSection } from "@/components/sections/trust";
import { BlogSection } from "@/components/sections/blog";
import { CTABanner } from "@/components/sections/cta-banner";
import { ConsultationSection } from "@/components/sections/consultation";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AIEngineSection />
      <TimelineSection />
      <FeaturesSection />
      <TrustSection />
      <BlogSection />
      <CTABanner />
      <ConsultationSection />
    </>
  );
}
