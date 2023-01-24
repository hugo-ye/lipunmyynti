// Import the functions from Firebase
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import {getFunctions} from "firebase/functions"

// Firebase web app configuration
const firebaseConfig = {
  apiKey: "AIzaSyBspdXDStLSdRNIYWXHEaCSX61WnvLik6Q",
  authDomain: "tk-bileet.firebaseapp.com",
  projectId: "tk-bileet",
  storageBucket: "tk-bileet.appspot.com",
  messagingSenderId: "319428814422",
  appId: "1:319428814422:web:1901f7fd24852688b5bdf7",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize features
export const auth = getAuth();
export const db = getFirestore();
export const functions = getFunctions(app);


