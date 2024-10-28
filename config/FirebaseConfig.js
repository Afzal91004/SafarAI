import { initializeApp } from "firebase/app";
import {
  getAuth,
  sendEmailVerification,
  sendPasswordResetEmail,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCf_h0T9QUTsdQ1SegvvWiZCZzUT2BPoFQ",
  authDomain: "safar-ai.firebaseapp.com",
  projectId: "safar-ai",
  storageBucket: "safar-ai.appspot.com",
  messagingSenderId: "769604925830",
  appId: "1:769604925830:web:b2f7dd590aaf4eb114d407",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Helper function to send verification email
export const sendVerificationEmail = async (user) => {
  try {
    await sendEmailVerification(user);
    return true;
  } catch (error) {
    console.error("Error sending verification email:", error);
    return false;
  }
};

// Helper function to send password reset email
export const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return true;
  } catch (error) {
    console.error("Error sending password reset email:", error);
    return false;
  }
};
