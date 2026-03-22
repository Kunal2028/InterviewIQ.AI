
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"
const firebaseConfig = {
  apiKey: "AIzaSyBe-Al-71Ouga0XYwP_Al3f2KceyzPEqvg",
  authDomain: "jobinterview-4fa2c.firebaseapp.com",
  projectId: "jobinterview-4fa2c",
  storageBucket: "jobinterview-4fa2c.firebasestorage.app",
  messagingSenderId: "666813634880",
  appId: "1:666813634880:web:83bf542d4a657c47bc42a5",
  measurementId: "G-YN4LT4SNEM"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new GoogleAuthProvider()

export {auth , provider}