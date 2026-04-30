import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "mock-api-key",
  authDomain: `${process.env.NEXT_PUBLIC_GCP_PROJECT_ID || "chunaav-494412"}.firebaseapp.com`,
  projectId: process.env.NEXT_PUBLIC_GCP_PROJECT_ID || "chunaav-494412",
  storageBucket: `${process.env.NEXT_PUBLIC_GCP_PROJECT_ID || "chunaav-494412"}.appspot.com`,
  messagingSenderId: "mock-sender-id",
  appId: "mock-app-id"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google", error);
    return null;
  }
};

export const logout = () => signOut(auth);
