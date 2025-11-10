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
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
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

        // Save user data to database
        saveUserProfile(userData.id, {
          name: userData.name,
          email: userData.email,
          picture: userData.picture,
          provider: userData.provider,
        }).catch(console.error);

        // Add to waitlist
        addToWaitlist(userData.id, {
          name: userData.name,
          email: userData.email,
          picture: userData.picture,
          provider: userData.provider,
        }).catch(console.error);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
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

        // Save user data to database
        saveUserProfile(userData.id, {
          name: userData.name,
          email: userData.email,
          picture: userData.picture,
          provider: userData.provider,
        }).catch(console.error);

        // Add to waitlist
        addToWaitlist(userData.id, {
          name: userData.name,
          email: userData.email,
          picture: userData.picture,
          provider: userData.provider,
        }).catch(console.error);
      } else {
        setUser(null);
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
