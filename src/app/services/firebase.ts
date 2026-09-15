// Firebase Authentication Service for Ideaforge
// @ts-ignore
import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
// @ts-ignore
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Firebase configuration provided for ideaforge-d1bf1
export const firebaseConfig = {
  apiKey: "AIzaSyCBQvmr6US8mnOTXXy7hImy2WYmRs9Ccgg",
  authDomain: "ideaforge-d1bf1.firebaseapp.com",
  projectId: "ideaforge-d1bf1",
  storageBucket: "ideaforge-d1bf1.firebasestorage.app",
  messagingSenderId: "771129309188",
  appId: "1:771129309188:web:ae7bd0b4d32f119bdb9d51"
};

// Initialize Firebase Singleton
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export interface GoogleAuthUser {
  displayName: string;
  email: string;
  photoURL?: string;
  uid: string;
  avatar?: string;
}

/**
 * Triggers Google OAuth Sign-in using Firebase Auth SDK
 */
export const firebaseGoogleSignIn = async (): Promise<GoogleAuthUser> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    const initials = (user.displayName || user.email || "Ideaforge User")
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    return {
      displayName: user.displayName || user.email?.split("@")[0] || "Ideaforge User",
      email: user.email || "",
      photoURL: user.photoURL || undefined,
      uid: user.uid,
      avatar: initials,
    };
  } catch (error: any) {
    console.error("Firebase Google Sign-In error:", error);
    throw error;
  }
};

/**
 * Triggers Email/Password authentication using Firebase Auth SDK
 */
export const firebaseEmailAuth = async (
  type: "login" | "signup",
  email: string,
  pass: string,
  fullName?: string
): Promise<GoogleAuthUser> => {
  try {
    const userCred =
      type === "signup"
        ? await createUserWithEmailAndPassword(auth, email, pass)
        : await signInWithEmailAndPassword(auth, email, pass);
    const user = userCred.user;
    const initials = (fullName || user.displayName || email)
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    return {
      displayName: fullName || user.displayName || email.split("@")[0] || "User",
      email: user.email || email,
      photoURL: user.photoURL || undefined,
      uid: user.uid,
      avatar: initials,
    };
  } catch (error: any) {
    console.error("Firebase Email Auth error:", error);
    throw error;
  }
};

export const firebaseLogout = async (): Promise<void> => {
  await firebaseSignOut(auth);
};

