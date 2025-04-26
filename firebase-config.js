// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCibfCaxP6tD-3cHA-Y1bIs2JonslkldjE",
    authDomain: "myblog-92747.firebaseapp.com",
    projectId: "myblog-92747",
    storageBucket: "myblog-92747.firebasestorage.app",
    messagingSenderId: "476743303480",
    appId: "1:476743303480:web:5be773d02c3536322b81cd",
    measurementId: "G-XLNJ55L038"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);