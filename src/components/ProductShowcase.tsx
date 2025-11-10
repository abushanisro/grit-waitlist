import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export const ProductShowcase = () => {
  const { elementRef, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 relative">
      <div
        ref={elementRef}
        className={`container mx-auto max-w-6xl transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden glass-effect neon-border">
          <div className="aspect-[4/3] sm:aspect-[16/10] md:aspect-[16/9] bg-gradient-to-br from-primary/10 via-background to-primary/5 flex items-center justify-center relative overflow-hidden">
            {/* Animated grid background */}
            <div className="absolute inset-0 opacity-20">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "linear-gradient(hsl(195 100% 47% / 0.1) 1px, transparent 1px), linear-gradient(90deg, hsl(195 100% 47% / 0.1) 1px, transparent 1px)",
                  backgroundSize: "30px 30px",
                }}
              ></div>
            </div>

            {/* Center content */}
            <div className="text-center p-6 sm:p-8 md:p-12 relative z-10">
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto mb-4 sm:mb-6 md:mb-8 rounded-2xl sm:rounded-3xl glass-effect neon-border flex items-center justify-center group hover:scale-110 transition-transform">
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 border-2 sm:border-3 md:border-4 border-primary rounded-xl sm:rounded-2xl group-hover:rotate-45 transition-transform"></div>
              </div>
              <p className="text-muted-foreground text-base sm:text-lg md:text-xl font-medium mb-2 sm:mb-3 md:mb-4">
                Platform Preview
              </p>
              <p className="text-primary text-xs sm:text-sm">Coming Soon</p>
            </div>

            {/* Floating elements */}
            <div className="absolute top-5 left-5 sm:top-10 sm:left-10 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-primary/20 rounded-xl sm:rounded-2xl blur-lg sm:blur-xl animate-pulse"></div>
            <div className="absolute bottom-5 right-5 sm:bottom-10 sm:right-10 w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-primary/10 rounded-full blur-xl sm:blur-2xl animate-pulse delay-500"></div>
          </div>
        </div>
      </div>
    </section>
  );
};
