import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase, signOut as supabaseSignOut, addToWaitlist, saveUserProfile } from "@/lib/supabase";
import { toast } from "sonner";

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

  useEffect(() => {
    // Listen for auth changes first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("🔔 Auth state changed:", event, session?.user?.email);

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

          console.log("✅ User authenticated:", userData.email);
          setUser(userData);
          setLoading(false);

          // Clean up URL hash after successful OAuth login
          if (window.location.hash.includes('access_token')) {
            window.history.replaceState(null, '', window.location.pathname);
          }

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

            if (added) {
              toast.success(`Welcome ${userData.name}! You've been added to the waitlist. 🎉`);
            } else {
              toast.success(`Welcome back, ${userData.name}! 👋`);
            }
          } catch (error) {
            console.error("Error saving user data:", error);
          }
        }
      } else if (event === 'SIGNED_OUT') {
        console.log("👋 User signed out");
        setUser(null);
        setLoading(false);
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
        console.error("❌ Error getting session:", error);
        setLoading(false);
        return;
      }

      if (session?.user) {
        console.log("📱 Existing session found:", session.user.email);
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
        console.log("ℹ️ No existing session found");
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
      await supabaseSignOut();
      setUser(null);
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Failed to log out");
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
