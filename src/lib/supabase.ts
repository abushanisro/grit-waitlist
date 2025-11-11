import { createClient } from '@supabase/supabase-js';

// Supabase configuration from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Initialize Supabase client with auth configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true, // This ensures Supabase detects and processes OAuth callback URLs
    flowType: 'implicit', // Use implicit flow for OAuth
  },
});

// User data interface
export interface UserData {
  name: string;
  email: string;
  picture?: string;
  provider: 'google' | 'linkedin';
}

// Add user to waitlist
export const addToWaitlist = async (userId: string, userData: UserData) => {
  try {
    console.log("📝 Adding user to waitlist...");

    // Check if user already exists in waitlist
    const { data: existing, error: checkError } = await supabase
      .from('waitlist')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (existing) {
      console.log("ℹ️ User already in waitlist");
      return false;
    }

    // Add to waitlist
    const { data, error } = await supabase
      .from('waitlist')
      .insert([
        {
          user_id: userId,
          name: userData.name,
          email: userData.email,
          picture: userData.picture,
          provider: userData.provider,
          status: 'pending',
        },
      ]);

    if (error) {
      console.error("❌ Error adding to waitlist:", error);
      throw error;
    }

    console.log("✅ User added to waitlist successfully");
    return true;
  } catch (error) {
    console.error("❌ Error in addToWaitlist:", error);
    throw error;
  }
};

// Save or update user profile
export const saveUserProfile = async (userId: string, userData: UserData) => {
  try {
    console.log("💾 Saving user profile...");

    const { data, error } = await supabase
      .from('user_profiles')
      .upsert([
        {
          id: userId,
          name: userData.name,
          email: userData.email,
          picture: userData.picture,
          provider: userData.provider,
        },
      ]);

    if (error) {
      console.error("❌ Error saving user profile:", error);
      throw error;
    }

    console.log("✅ User profile saved successfully");
    return data;
  } catch (error) {
    console.error("❌ Error in saveUserProfile:", error);
    throw error;
  }
};

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    console.log("🔵 Starting Google sign-in...");

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) {
      console.error("❌ Google sign-in error:", error);
      throw error;
    }

    console.log("✅ Google sign-in initiated");
    return data;
  } catch (error: any) {
    console.error("❌ Error in signInWithGoogle:", error);
    throw new Error(error.message || "Failed to sign in with Google");
  }
};

// Sign in with LinkedIn
export const signInWithLinkedIn = async () => {
  try {
    console.log("🔵 Starting LinkedIn sign-in...");

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'linkedin_oidc',
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) {
      console.error("❌ LinkedIn sign-in error:", error);
      throw error;
    }

    console.log("✅ LinkedIn sign-in initiated");
    return data;
  } catch (error: any) {
    console.error("❌ Error in signInWithLinkedIn:", error);

    // Provide user-friendly error messages
    if (error.message?.includes('not enabled')) {
      throw new Error("LinkedIn sign-in is not enabled. Please enable it in Supabase Dashboard.");
    } else {
      throw new Error(error.message || "Failed to sign in with LinkedIn");
    }
  }
};

// Sign out
export const signOut = async () => {
  try {
    console.log("🔵 Signing out...");

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("❌ Sign out error:", error);
      throw error;
    }

    console.log("✅ Signed out successfully");
  } catch (error: any) {
    console.error("❌ Error in signOut:", error);
    throw new Error(error.message || "Failed to sign out");
  }
};

// Get current session
export const getCurrentSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();

  if (error) {
    console.error("❌ Error getting session:", error);
    return null;
  }

  return session;
};

// Listen to auth state changes
export const onAuthStateChange = (callback: (event: string, session: any) => void) => {
  return supabase.auth.onAuthStateChange(callback);
};
