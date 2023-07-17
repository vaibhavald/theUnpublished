import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC0SrbUt1DVFA26eyjR0sue5oSp2hSlixM",

  authDomain: "theunpublishedclub-7799a.firebaseapp.com",

  projectId: "theunpublishedclub-7799a",

  storageBucket: "theunpublishedclub-7799a.appspot.com",

  messagingSenderId: "978199846690",

  appId: "1:978199846690:web:b4c999f7517f3e2408cf7b",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
