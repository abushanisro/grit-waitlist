import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import gritDemo from "@/assets/grit-demo.svg";

export const ProductShowcase = () => {
  const { elementRef, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 relative">
    </section>
  );
};
