// src/api/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDZyTzdfBUMZqHHIOazinyGT0fOje62u6c",
  authDomain: "chatbottask1-78873.firebaseapp.com",
  projectId: "chatbottask1-78873",
  storageBucket: "chatbottask1-78873.firebasestorage.app",
  messagingSenderId: "414420622756",
  appId: "1:414420622756:web:2af6d219cd6cffc3ccb531",
  measurementId: "G-B82FETGFEG"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
