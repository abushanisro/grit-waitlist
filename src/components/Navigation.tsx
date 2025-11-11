import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import gritLogo from "@/assets/grit-logo.png";
import { WaitlistFormModal } from "./WaitlistFormModal";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";

export const Navigation = () => {
  const { isAuthenticated, user, logout, openAuthModal } = useAuth();
  const [showWaitlistForm, setShowWaitlistForm] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className="fixed top-2 left-2 right-2 sm:top-4 sm:left-4 sm:right-4 z-50">
      <div className="container mx-auto max-w-3xl px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-full glass-effect border border-primary/20 backdrop-blur-xl shadow-2xl">
        <div className="flex items-center justify-between">
          {/* Logo - Bigger size */}
          <div className="flex items-center gap-3 group">
            <div className="relative">
              <img
                src={gritLogo}
                alt="GRIT"
                className="h-10 sm:h-12 md:h-14 w-auto transition-all duration-500 group-hover:scale-110"
              />
              <div className="absolute -inset-2 bg-primary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          </div>

          {/* Navigation - Visible on all screens */}
          <div className="flex items-center gap-2 sm:gap-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8 border-2 border-primary/30">
                    {user?.picture && (
                      <AvatarImage src={user.picture} alt={user?.name || 'User'} />
                    )}
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
                      {user?.name ? getInitials(user.name) : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium hidden md:inline">
                    {user?.name}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="px-2 sm:px-3 py-1.5 text-foreground font-medium hover:text-primary transition-colors duration-300 text-sm sm:text-base"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={openAuthModal}
                  className="px-2 sm:px-3 py-1.5 text-foreground font-medium hover:text-primary transition-colors duration-300 text-sm sm:text-base"
                >
                  Log In
                </button>

                <button
                  onClick={() => setShowWaitlistForm(true)}
                  className="px-3 sm:px-4 py-1.5 bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors duration-300 rounded-full text-sm sm:text-base flex items-center gap-1 sm:gap-1.5 whitespace-nowrap"
                >
                  <span className="hidden sm:inline">Join Waitlist</span>
                  <span className="sm:hidden">Join</span>
                  <span className="transition-transform group-hover:translate-x-0.5">→</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Waitlist Form Modal */}
      <WaitlistFormModal
        isOpen={showWaitlistForm}
        onClose={() => setShowWaitlistForm(false)}
      />
    </nav>
  );
};
