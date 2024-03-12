// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCwMsUXXAvFm0uX_Ea3HA01GT5Om8-SYGw",
  authDomain: "movie-3d803.firebaseapp.com",
  projectId: "movie-3d803",
  storageBucket: "movie-3d803.appspot.com",
  messagingSenderId: "167461425313",
  appId: "1:167461425313:web:17bd7dba64301ef5c5a0e0",
  measurementId: "G-5DSEM2SX5C"
};

// Initialize Firebase
initializeApp(firebaseConfig);

const db = getFirestore()
export default db;