
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBYeBobno_klBJElYz_y3f72XUBxJg1zVg",
  authDomain: "warmverse-88e9b.firebaseapp.com",
  projectId: "warmverse-88e9b",
  storageBucket: "warmverse-88e9b.firebasestorage.app",
  messagingSenderId: "193083132318",
  appId: "1:193083132318:web:0807e5c3eefe8ecc08ae8f",
  measurementId: "G-7ZBZLKEMJ4"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
