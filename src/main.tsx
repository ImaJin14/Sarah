import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
// import { ThemeProvider } from './hooks/useTheme.tsx';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD7UBD3VXxM8yNv7k1gTS6EE_ysYzk7HYg",
  authDomain: "smartflow-8ff0f.firebaseapp.com",
  projectId: "smartflow-8ff0f",
  storageBucket: "smartflow-8ff0f.firebasestorage.app",
  messagingSenderId: "1091974674117",
  appId: "1:1091974674117:web:2c2345e85b22014940a2ac",
  measurementId: "G-79TNK9PMEQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);


createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* <ThemeProvider> */}
     <App />
    {/* </ThemeProvider> */}
  </React.StrictMode>
);
