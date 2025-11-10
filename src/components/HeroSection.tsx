import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import ColorBends from "./ColorBends";

export const HeroSection = () => {
  const [scrollY, setScrollY] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const { openAuthModal } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const opacity = Math.max(0, 1 - scrollY / 500);
  const translateY = scrollY * 0.3;

  return (
    <section
      ref={sectionRef}
      className="relative pt-28 sm:pt-32 md:pt-40 pb-16 sm:pb-20 px-4 sm:px-6 overflow-hidden"
    >
      {/* ColorBends Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <ColorBends
          colors={["#0ea5e9", "#8b5cf6", "#06b6d4"]}
          rotation={30}
          speed={0.3}
          scale={1.2}
          frequency={1.4}
          warpStrength={1.2}
          mouseInfluence={0.8}
          parallax={0.6}
          noise={0.08}
          transparent
        />
      </div>

      {/* Static background elements for fallback */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-5 sm:left-10 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-5 sm:right-10 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div
        className="container mx-auto max-w-5xl text-center relative z-10"
        style={{
          opacity,
          transform: `translateY(${translateY}px)`,
          transition: "transform 0.1s ease-out",
        }}
      >
        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light text-foreground mb-6 sm:mb-8 leading-relaxed tracking-wide px-2">
          <span className="text-gradient">Build your Sales</span>
          <br />
          <span className="text-gradient">career with GRIT</span>
        </h1>

        {/* Description */}
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground mb-8 sm:mb-10 md:mb-12 max-w-3xl mx-auto leading-relaxed px-4 font-light">
          Discover opportunities that match your grit, goals, and growth.
        </p>

        {/* CTA Button */}
        <Button
          size="lg"
          onClick={openAuthModal}
          className="bg-primary/70 hover:bg-primary/80 text-primary-foreground font-bold text-base sm:text-lg px-8 sm:px-10 md:px-12 py-6 sm:py-7 rounded-full hover:shadow-xl transition-all w-full sm:w-auto max-w-xs sm:max-w-none"
        >
          Join Waitlist →
        </Button>
      </div>
    </section>
  );
};
