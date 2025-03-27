import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  GithubAuthProvider, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updateProfile, 
  sendPasswordResetEmail 
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBcuBVj4jj38kH-x9DlPoaC7xN70Lb3k0c",
  authDomain: "login-63f67.firebaseapp.com",
  projectId: "login-63f67",
  storageBucket: "login-63f67.appspot.com",
  messagingSenderId: "636293571342",
  appId: "1:636293571342:web:f1465b35e4a19a60b2ed5f",
  measurementId: "G-ZQ98172RWZ",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.useDeviceLanguage(); // Add this line

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account",
  login_hint: "",
});

const githubProvider = new GithubAuthProvider();
githubProvider.setCustomParameters({
  allow_signup: "true",
});

const db = getFirestore(app);
const storage = getStorage(app);

export {
  auth,
  db,
  storage,
  googleProvider,
  githubProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
};