// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD-eji4eEDaaOiCbFVF5rNedwgHoNNmsZA",
  authDomain: "dave-bot-f7fab.firebaseapp.com",
  projectId: "dave-bot-f7fab",
  storageBucket: "dave-bot-f7fab.appspot.com",
  messagingSenderId: "567107094286",
  appId: "1:567107094286:web:6c4c26a3cf4d903da0b95f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

module.exports = { db };