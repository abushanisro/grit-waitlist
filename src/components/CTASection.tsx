import { useState } from "react";
import { Button } from "@/components/ui/button";
import { WaitlistFormModal } from "./WaitlistFormModal";

export const CTASection = () => {
  const [showWaitlistForm, setShowWaitlistForm] = useState(false);

  return (
    <>
      <section className="relative py-20 sm:py-24 md:py-32 px-4 sm:px-6 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/50 to-background pointer-events-none"></div>

        {/* Subtle background glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 sm:w-[600px] sm:h-[600px] bg-primary/5 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 sm:mb-8 leading-tight">
            Ready to take your
            <br />
            <span className="text-gradient">sales career to the next level?</span>
          </h2>

          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 sm:mb-10 md:mb-12 max-w-3xl mx-auto leading-relaxed px-4">
            No waiting weeks for opportunities, no setup headaches, no middlemen.
            We connect you personally with roles tailored to your skills so you can focus on growth.
          </p>

          <Button
            size="lg"
            onClick={() => setShowWaitlistForm(true)}
            className="min-h-[52px] sm:min-h-[56px] bg-primary hover:bg-primary/90 active:scale-95 text-primary-foreground font-bold text-base sm:text-lg lg:text-xl px-8 sm:px-10 md:px-12 py-3.5 sm:py-4 rounded-full hover:shadow-2xl shadow-lg transition-all duration-300 w-full sm:w-auto max-w-sm sm:max-w-md group"
            aria-label="Join the waitlist"
          >
            <span>Join Waitlist</span>
            <span className="inline-block ml-2 transition-transform group-hover:translate-x-1" aria-hidden="true">
              →
            </span>
          </Button>
        </div>
      </section>

      {/* Waitlist Form Modal */}
      <WaitlistFormModal
        isOpen={showWaitlistForm}
        onClose={() => setShowWaitlistForm(false)}
      />
    </>
  );
};
