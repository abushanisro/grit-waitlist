import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import gritDemo from "@/assets/grit-demo.svg";

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
            <div className="w-full h-full relative z-10">
              <img
                src={gritDemo}
                alt="Grit Platform Preview"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Floating elements */}
            <div className="absolute top-5 left-5 sm:top-10 sm:left-10 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-primary/20 rounded-xl sm:rounded-2xl blur-lg sm:blur-xl animate-pulse"></div>
            <div className="absolute bottom-5 right-5 sm:bottom-10 sm:right-10 w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-primary/10 rounded-full blur-xl sm:blur-2xl animate-pulse delay-500"></div>
          </div>
        </div>

        {/* Site Preview Arrow */}
        <div className="flex flex-col items-center mt-8 sm:mt-12 gap-2 sm:gap-3 animate-bounce">
          <svg
            className="w-6 h-6 sm:w-8 sm:h-8 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
          <p className="text-sm sm:text-base text-muted-foreground font-medium">
            Site Preview
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground/70 max-w-md text-center px-4">
            See how your sales career takes flight with our platform
          </p>
        </div>
      </div>
    </section>
  );
};
