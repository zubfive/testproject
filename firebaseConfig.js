// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBItHFyoUtZoay1Ttkjlczh8t0fDVcloHs",
  authDomain: "alarm-app-1e3ef.firebaseapp.com",
  projectId: "alarm-app-1e3ef",
  storageBucket: "alarm-app-1e3ef.appspot.com",
  messagingSenderId: "661923233533",
  appId: "1:661923233533:web:9d28ff4e604b16bc474894",
  measurementId: "G-G9MQSWCCTE"
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db };
