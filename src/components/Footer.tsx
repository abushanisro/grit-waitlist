import gritLogo from "@/assets/grit-logo.png";

export const Footer = () => {
  return (
    <footer className="py-12 sm:py-14 md:py-16 px-4 sm:px-6 border-t border-primary/20 relative">
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-50"></div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
          {/* Logo */}
          <div className="flex items-center gap-3 order-1 md:order-1">
            <img src={gritLogo} alt="GRIT" className="h-7 sm:h-8 w-auto" />
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 sm:gap-8 text-xs sm:text-sm text-muted-foreground order-3 md:order-2">
            <a href="#" className="hover:text-primary transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Contact
            </a>
          </div>

          {/* Copyright */}
          <p className="text-xs sm:text-sm text-muted-foreground order-2 md:order-3 text-center md:text-right">
            © 2024 GRIT. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
