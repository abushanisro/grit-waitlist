import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import gritLogo from "@/assets/grit-logo.png";
import { WaitlistFormModal } from "./WaitlistFormModal";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { LogOut } from "lucide-react";

export const Navigation = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [showWaitlistForm, setShowWaitlistForm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return; // Prevent double clicks

    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
      setIsLoggingOut(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className="fixed top-2 left-2 right-2 sm:top-4 sm:left-4 sm:right-4 z-50" role="navigation" aria-label="Main navigation">
      <div className="container mx-auto max-w-3xl px-3 sm:px-4 lg:px-5 py-2 sm:py-2.5 rounded-full glass-effect border border-primary/20 backdrop-blur-xl shadow-2xl">
        <div className="flex items-center justify-between">
          {/* Logo - Bigger size */}
          <a href="/" className="flex items-center gap-3 group focus:outline-none" aria-label="GRIT Home">
            <div className="relative">
              <img
                src={gritLogo}
                alt="GRIT Logo"
                className="h-11 sm:h-13 md:h-15 w-auto transition-all duration-500 group-hover:scale-110 group-focus:scale-110"
              />
              <div className="absolute -inset-2 bg-primary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-500"></div>
            </div>
          </a>

          {/* Navigation - Visible on all screens */}
          <div className="flex items-center gap-2 sm:gap-3">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-2 sm:gap-2.5">
                  <Avatar className="h-9 w-9 sm:h-10 sm:w-10 border-2 border-primary/30">
                    {user?.picture && (
                      <AvatarImage src={user.picture} alt={user?.name || 'User'} />
                    )}
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
                      {user?.name ? getInitials(user.name) : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium hidden md:inline truncate max-w-[120px]">
                    {user?.name}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="min-h-[44px] min-w-[44px] px-3 sm:px-4 py-2.5 text-foreground font-medium hover:text-primary active:scale-95 transition-all duration-200 text-sm sm:text-base flex items-center justify-center gap-1.5 group disabled:opacity-50 disabled:cursor-not-allowed rounded-lg hover:bg-primary/10"
                  title="Logout"
                  aria-label="Logout from account"
                >
                  <span className="hidden sm:inline">{isLoggingOut ? "Logging out..." : "Logout"}</span>
                  <LogOut className="h-5 w-5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowWaitlistForm(true)}
                className="min-h-[44px] px-4 sm:px-5 py-2.5 bg-primary text-primary-foreground font-medium hover:bg-primary/90 active:scale-95 transition-all duration-200 rounded-full text-sm sm:text-base flex items-center gap-1.5 sm:gap-2 whitespace-nowrap shadow-lg hover:shadow-xl"
                aria-label="Join the waitlist"
              >
                <span className="hidden sm:inline">Join Waitlist</span>
                <span className="sm:hidden">Join</span>
                <span className="transition-transform group-hover:translate-x-0.5" aria-hidden="true">→</span>
              </button>
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
