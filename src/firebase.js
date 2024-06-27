import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCONfZ_B-yTrE91aK9kBVCGdLx4On0ToYo",
  authDomain: "staras-89a8a.firebaseapp.com",
  projectId: "staras-89a8a",
  storageBucket: "staras-89a8a.appspot.com",
  messagingSenderId: "985770940523",
  appId: "1:985770940523:web:74f948e11fc51ebcfdf92e",
  measurementId: "G-2K6QZX4R0W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const imageDb = getStorage(app);