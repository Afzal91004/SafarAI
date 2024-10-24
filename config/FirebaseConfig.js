import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCf_h0T9QUTsdQ1SegvvWiZCZzUT2BPoFQ",
  authDomain: "safar-ai.firebaseapp.com",
  projectId: "safar-ai",
  storageBucket: "safar-ai.appspot.com",
  messagingSenderId: "769604925830",
  appId: "1:769604925830:web:b2f7dd590aaf4eb114d407",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
