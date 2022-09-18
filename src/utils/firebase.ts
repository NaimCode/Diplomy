import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD7Vk2c4EjoDvXNVnIj8vsFb6q8GlzTDSg",
  authDomain: "eternum-ba998.firebaseapp.com",
  projectId: "eternum-ba998",
  storageBucket: "eternum-ba998.appspot.com",
  messagingSenderId: "251238822903",
  appId: "1:251238822903:web:e5b69bcdcfe9df1452f4f2"
};

// Initialize Firebase
export const App = initializeApp(firebaseConfig);
export const Storage = getStorage(App);