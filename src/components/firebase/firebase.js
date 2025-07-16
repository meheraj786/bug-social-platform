// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDnxQ2KMNsdl7eWEPMOlzsREvbhNuwWYiA",
  authDomain: "simple-blog-82fca.firebaseapp.com",
  databaseURL: "https://simple-blog-82fca-default-rtdb.firebaseio.com",
  projectId: "simple-blog-82fca",
  storageBucket: "simple-blog-82fca.firebasestorage.app",
  messagingSenderId: "446891781819",
  appId: "1:446891781819:web:1fe08a12928139cfe0039e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default firebaseConfig