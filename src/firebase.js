import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyCtYdYmERI4uaERAEJqUIbAXYa7LuiyQ_U",
  authDomain: "quiniela-mundial-79146.firebaseapp.com",
  projectId: "quiniela-mundial-79146",
  storageBucket: "quiniela-mundial-79146.firebasestorage.app",
  messagingSenderId: "251118704148",
  appId: "1:251118704148:web:d92ced266252dee8307901",
  measurementId: "G-CELCG3VHYT"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
``
