// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDFrBzg37f8-NtjTI3w03v4ZgTJxOdkEOU",
  authDomain: "lab7-50925.firebaseapp.com",
  projectId: "lab7-50925",
  storageBucket: "lab7-50925.firebasestorage.app",
  messagingSenderId: "498026313187",
  appId: "1:498026313187:web:0bbac42a06d73a2b04dcd6",
  measurementId: "G-KCHMEGRQ46",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const registerUser = async (email: string, password: string) => {
  try {
    console.log("Registering user with email:", email);
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    console.log(userCredential.user);
    return { isRegistered: true, user: userCredential };
  } catch (error) {
    console.error(error);
    return { isRegistered: false, error: error };
  }
};

const loginUser = async (email: string, password: string) => {
  try {
    console.log("Logging in user with email:", email);
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    console.log(userCredential.user);
    return { isLoggedIn: true, user: userCredential };
  } catch (error) {
    console.error(error);
    return { isLoggedIn: false, error: error };
  }
};

export { db, auth, registerUser, loginUser };
