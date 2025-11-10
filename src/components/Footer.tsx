import gritLogo from "@/assets/grit-logo.png";
import { Instagram, Linkedin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="py-8 sm:py-10 md:py-12 px-4 sm:px-6 border-t border-primary/20 relative bg-background">
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-50"></div>

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-8 mb-8">
          {/* Left: Logo & Tagline */}
          <div className="flex flex-col gap-3">
            <img
              src={gritLogo}
              alt="Grit Recruitment"
              className="h-10 sm:h-12 md:h-14 w-auto object-contain"
              style={{ maxWidth: '200px' }}
            />
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xs leading-relaxed">
              Empowering sales professionals to find careers that match their grit, goals, and growth.
            </p>
          </div>

          {/* Center: Social Media Icons */}
          <div className="flex items-center gap-4 md:absolute md:left-1/2 md:transform md:-translate-x-1/2">
            <a
              href="https://www.instagram.com/saleswithgrit/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="Follow us on Instagram"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a
              href="https://www.linkedin.com/company/gritrecruit/posts/?feedView=all"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="Follow us on LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
          </div>

          {/* Right: Legal Links */}
          <div className="flex items-center gap-4 text-xs sm:text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">
              Terms of Service
            </a>
            <span className="text-muted-foreground/50">-</span>
            <a href="#" className="hover:text-primary transition-colors">
              Privacy Policy
            </a>
          </div>
        </div>

        {/* Bottom: Copyright */}
        <div className="pt-6 border-t border-primary/10">
          <p className="text-xs text-muted-foreground text-center md:text-left">
            Grit Recruitment - {new Date().getFullYear()} All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
};
