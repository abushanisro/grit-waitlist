import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, OAuthProvider } from "firebase/auth";
import { getFirestore, collection, addDoc, serverTimestamp, doc, setDoc, getDoc } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;

// Auth providers
export const googleProvider = new GoogleAuthProvider();
export const linkedInProvider = new OAuthProvider("linkedin.com");

// Configure LinkedIn provider
linkedInProvider.addScope("openid");
linkedInProvider.addScope("profile");
linkedInProvider.addScope("email");

// Helper function to add user to waitlist
export const addToWaitlist = async (userId: string, userData: {
  name: string;
  email: string;
  provider: string;
  picture?: string;
}) => {
  try {
    // Check if user already exists in waitlist
    const userDoc = await getDoc(doc(db, "waitlist", userId));

    if (!userDoc.exists()) {
      // Add to waitlist collection
      await setDoc(doc(db, "waitlist", userId), {
        ...userData,
        joinedAt: serverTimestamp(),
        status: "pending",
      });
      console.log("User added to waitlist successfully");
      return true;
    } else {
      console.log("User already in waitlist");
      return false;
    }
  } catch (error) {
    console.error("Error adding to waitlist:", error);
    throw error;
  }
};

// Helper function to save user profile
export const saveUserProfile = async (userId: string, userData: any) => {
  try {
    await setDoc(doc(db, "users", userId), {
      ...userData,
      updatedAt: serverTimestamp(),
    }, { merge: true });
    console.log("User profile saved successfully");
  } catch (error) {
    console.error("Error saving user profile:", error);
    throw error;
  }
};

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    const userData = {
      name: user.displayName || "",
      email: user.email || "",
      picture: user.photoURL || "",
      provider: "google",
    };

    // Save user profile
    await saveUserProfile(user.uid, userData);

    // Add to waitlist
    await addToWaitlist(user.uid, userData);

    return { user, userData };
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

// Sign in with LinkedIn (Note: LinkedIn OAuth requires backend setup)
export const signInWithLinkedIn = async () => {
  try {
    const result = await signInWithPopup(auth, linkedInProvider);
    const user = result.user;

    const userData = {
      name: user.displayName || "",
      email: user.email || "",
      picture: user.photoURL || "",
      provider: "linkedin",
    };

    // Save user profile
    await saveUserProfile(user.uid, userData);

    // Add to waitlist
    await addToWaitlist(user.uid, userData);

    return { user, userData };
  } catch (error) {
    console.error("Error signing in with LinkedIn:", error);
    throw error;
  }
};
