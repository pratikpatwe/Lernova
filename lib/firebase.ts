import { initializeApp, getApps } from "firebase/app";
import { getDatabase } from "firebase/database";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.FB_API_KEY,
  authDomain: "lernova-3898e.firebaseapp.com",
  databaseURL: "https://lernova-3898e-default-rtdb.firebaseio.com",
  projectId: "lernova-3898e",
  storageBucket: "lernova-3898e.firebasestorage.app",
  messagingSenderId: "367508505388",
  appId: "1:367508505388:web:7d64e3fecadf466a8ba289",
  measurementId: "G-9LVG2JL1D2"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const database = getDatabase(app);

