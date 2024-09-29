// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCf_h0T9QUTsdQ1SegvvWiZCZzUT2BPoFQ",
  authDomain: "safar-ai.firebaseapp.com",
  projectId: "safar-ai",
  storageBucket: "safar-ai.appspot.com",
  messagingSenderId: "769604925830",
  appId: "1:769604925830:web:b2f7dd590aaf4eb114d407",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth and Google Auth Provider
export const auth = getAuth(app);
