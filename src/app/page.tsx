import { LandingNav } from "@/components/landing/LandingNav";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Features } from "@/components/landing/Features";
import { CTASection } from "@/components/landing/CTASection";

export default function Home() {
  return (
    <div className="flex-1">
      <LandingNav />
      <Hero />
      <HowItWorks />
      <Features />
      <CTASection />
    </div>
  );
}
