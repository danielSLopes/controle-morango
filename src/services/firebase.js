import { initializeApp } from "firebase/app";
const apiKeyFirebase = process.env.REACT_APP_API_URL;

const firebaseConfig = initializeApp({
  apiKey: apiKeyFirebase,
  authDomain: "controle-morango.firebaseapp.com",
  projectId: "controle-morango",
  storageBucket: "controle-morango.firebasestorage.app",
  messagingSenderId: "465016870980",
  appId: "1:465016870980:web:ae64cbf5806fdb161f0411",
});

export default firebaseConfig;