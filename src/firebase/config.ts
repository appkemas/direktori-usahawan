import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyClAmo0RRkK2XsLLKHE3Tb5_2_LB2a7XHk",
  authDomain: "appkemas.firebaseapp.com",
  projectId: "appkemas",
  storageBucket: "appkemas.firebasestorage.app",
  messagingSenderId: "83209749064",
  appId: "1:83209749064:web:b12c93bdf3a7281d108e7d",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
