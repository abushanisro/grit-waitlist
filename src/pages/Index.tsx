import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { ProductShowcase } from "@/components/ProductShowcase";
import { FeaturesSection } from "@/components/FeaturesSection";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <ProductShowcase />
      <FeaturesSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
