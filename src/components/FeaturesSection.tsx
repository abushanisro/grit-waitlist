import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export const FeaturesSection = () => {
  const { elementRef: headerRef, isVisible: headerVisible } = useScrollAnimation({ threshold: 0.2 });
  const { elementRef: cardsRef, isVisible: cardsVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-64 sm:h-64 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 sm:w-64 sm:h-64 bg-primary/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Header */}
        <div
          ref={headerRef}
          className={`text-center mb-12 sm:mb-16 md:mb-20 transition-all duration-1000 ${
            headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 sm:mb-8 px-2">
            <span className="text-gradient">Your Career</span>
            <br />
            <span className="text-foreground">Powered by GRIT</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4">
            Where <span className="text-primary font-semibold">ambition meets opportunity</span> —
            connecting driven sales professionals with roles that fuel growth
          </p>
        </div>

        {/* Feature Cards */}
        <div
          ref={cardsRef}
          className={`grid md:grid-cols-2 gap-6 sm:gap-8 mt-8 sm:mt-12 md:mt-16 transition-all duration-1000 delay-200 ${
            cardsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {/* Job Seekers Card */}
          <div className="group relative p-6 sm:p-8 md:p-10 lg:p-12 rounded-2xl sm:rounded-3xl glass-effect hover:border-primary transition-all duration-500">
            <div className="absolute inset-0 bg-primary/5 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="mb-4 sm:mb-6">
                <h3 className="text-2xl sm:text-2xl md:text-3xl font-bold text-foreground mb-3 sm:mb-4">
                  For Job Seekers
                </h3>
                <p className="text-muted-foreground text-sm sm:text-base md:text-lg leading-relaxed">
                  Find roles that match your drive, skills, and career aspirations.
                  Build your future with opportunities designed for growth.
                </p>
              </div>
              <div className="space-y-2 sm:space-y-3 pt-4 sm:pt-6 border-t border-primary/20">
                {["Match your skills", "Growth-focused roles", "Career advancement"].map(
                  (feature) => (
                    <div key={feature} className="flex items-center gap-2 sm:gap-3 group/item">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary group-hover/item:scale-150 transition-transform flex-shrink-0"></div>
                      <span className="text-sm sm:text-base text-foreground/80 group-hover/item:text-primary transition-colors">
                        {feature}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Employers Card */}
          <div className="group relative p-6 sm:p-8 md:p-10 lg:p-12 rounded-2xl sm:rounded-3xl glass-effect hover:border-primary transition-all duration-500">
            <div className="absolute inset-0 bg-primary/5 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="mb-4 sm:mb-6">
                <h3 className="text-2xl sm:text-2xl md:text-3xl font-bold text-foreground mb-3 sm:mb-4">
                  For Employers
                </h3>
                <p className="text-muted-foreground text-sm sm:text-base md:text-lg leading-relaxed">
                  Connect with top sales talent who have the grit and determination
                  to drive your business forward.
                </p>
              </div>
              <div className="space-y-2 sm:space-y-3 pt-4 sm:pt-6 border-t border-primary/20">
                {["Quality candidates", "Proven performers", "Fast hiring"].map((feature) => (
                  <div key={feature} className="flex items-center gap-2 sm:gap-3 group/item">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary group-hover/item:scale-150 transition-transform flex-shrink-0"></div>
                    <span className="text-sm sm:text-base text-foreground/80 group-hover/item:text-primary transition-colors">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
