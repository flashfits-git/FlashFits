// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDm2x2p7FGky5jLZuYfJtCWGEuHHQDpwtg",
  authDomain: "flashfits-58153.firebaseapp.com",
  projectId: "flashfits-58153",
  storageBucket: "flashfits-58153.firebasestorage.app",
  messagingSenderId: "941890403581",
  appId: "1:941890403581:web:7ebfe4e30efe2e7dc11294",
  measurementId: "G-4SS3MG0RDE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);