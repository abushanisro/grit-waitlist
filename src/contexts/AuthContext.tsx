import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase, signOut as supabaseSignOut, addToWaitlist, saveUserProfile } from "@/lib/supabase";
import { toast } from "sonner";
import confetti from "canvas-confetti";

interface User {
  id: string;
  name: string;
  email: string;
  picture?: string;
  provider: "google" | "linkedin";
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (userData: User) => void;
  logout: () => Promise<void>;
  showAuthModal: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Celebration confetti effect
  const celebrate = () => {
    const duration = 2500;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval: NodeJS.Timeout = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
  };

  useEffect(() => {
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
        if (session?.user) {
          const supabaseUser = session.user;
          const userData: User = {
            id: supabaseUser.id,
            name: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || "",
            email: supabaseUser.email || "",
            picture: supabaseUser.user_metadata?.avatar_url || supabaseUser.user_metadata?.picture || "",
            provider: supabaseUser.app_metadata?.provider === "google" ? "google" : "linkedin",
          };

          setUser(userData);
          setLoading(false);

          // Check if this is an OAuth callback with hash
          const isOAuthCallback = window.location.hash.includes('access_token');

          // Save user data to database
          try {
            await saveUserProfile(userData.id, {
              name: userData.name,
              email: userData.email,
              picture: userData.picture,
              provider: userData.provider,
            });

            // Add to waitlist
            const added = await addToWaitlist(userData.id, {
              name: userData.name,
              email: userData.email,
              picture: userData.picture,
              provider: userData.provider,
            });

            // If this is an OAuth callback, save the welcome state and redirect
            if (isOAuthCallback) {
              // Mark that this user just signed up/signed in for celebration after reload
              if (added) {
                // New user - show thank you modal after reload
                sessionStorage.setItem('grit_show_thankyou', JSON.stringify({ name: userData.name, email: userData.email }));
              } else {
                // Returning user - show simple welcome toast after reload
                sessionStorage.setItem('grit_returning_user', JSON.stringify({ name: userData.name }));
              }

              // Redirect to clean URL - celebration will happen after reload
              setTimeout(() => {
                window.location.replace(window.location.pathname);
              }, 100);
            } else {
              // Not an OAuth callback - check if we should show welcome message (after page reload)
              const returningUserData = sessionStorage.getItem('grit_returning_user');

              if (returningUserData) {
                // Clear the flag
                sessionStorage.removeItem('grit_returning_user');
                const userData = JSON.parse(returningUserData);

                // Returning user - simple welcome
                toast.success(`👋 Welcome back, ${userData.name}!`, {
                  duration: 4000,
                  description: "Great to see you again!",
                });
              }
              // Note: New user celebration is handled by ThankYouModal component
            }
          } catch (error) {
            console.error("Error saving user data:", error);
          }
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setLoading(false);
        sessionStorage.clear();
      } else {
        // For other events, just check the session
        if (session?.user) {
          const supabaseUser = session.user;
          const userData: User = {
            id: supabaseUser.id,
            name: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || "",
            email: supabaseUser.email || "",
            picture: supabaseUser.user_metadata?.avatar_url || supabaseUser.user_metadata?.picture || "",
            provider: supabaseUser.app_metadata?.provider === "google" ? "google" : "linkedin",
          };
          setUser(userData);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    });

    // Check current session after setting up the listener
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        setLoading(false);
        return;
      }

      if (session?.user) {
        const supabaseUser = session.user;
        const userData: User = {
          id: supabaseUser.id,
          name: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || "",
          email: supabaseUser.email || "",
          picture: supabaseUser.user_metadata?.avatar_url || supabaseUser.user_metadata?.picture || "",
          provider: supabaseUser.app_metadata?.provider === "google" ? "google" : "linkedin",
        };
        setUser(userData);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    closeAuthModal();
    toast.success(`Welcome back, ${userData.name}! 🎉`);
  };

  const logout = async () => {
    try {
      // Create a timeout promise
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("SignOut timeout after 5 seconds")), 5000);
      });

      // Race between signOut and timeout
      const signOutPromise = supabase.auth.signOut({ scope: 'local' });

      const { error } = await Promise.race([signOutPromise, timeoutPromise]) as { error: any };

      if (error) {
        console.error("Supabase signOut error:", error);
        throw error;
      }

      // Clear session storage AFTER signout
      sessionStorage.clear();

      // Clear user state
      setUser(null);
      setLoading(false);

      // Show success message
      toast.success("👋 Logged out successfully", {
        description: "See you next time!",
        duration: 2000,
      });

    } catch (error: any) {
      // Even if signOut fails, clear local state
      if (error.message?.includes("timeout")) {
        // Timeout is expected - Supabase signOut sometimes hangs
        // Clear local session anyway
        sessionStorage.clear();
        setUser(null);
        setLoading(false);

        toast.success("👋 Logged out successfully", {
          description: "See you next time!",
          duration: 2000,
        });
      } else {
        // Unexpected error - log it and show error to user
        console.error("Logout error:", error);
        toast.error("Failed to log out", {
          description: error?.message || "Please try again",
        });
        throw error;
      }
    }
  };

  const openAuthModal = () => setShowAuthModal(true);
  const closeAuthModal = () => setShowAuthModal(false);

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    logout,
    showAuthModal,
    openAuthModal,
    closeAuthModal,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
