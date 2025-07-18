// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBtNqp67AtQQF2cr-pkXP3IQAWjMGW1zPk",
  authDomain: "blackandwhiteblog-3b393.firebaseapp.com",
  projectId: "blackandwhiteblog-3b393",
  storageBucket: "blackandwhiteblog-3b393.firebasestorage.app",
  messagingSenderId: "338132863759",
  appId: "1:338132863759:web:f96a02f58a64530e0d4c7a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default firebaseConfig