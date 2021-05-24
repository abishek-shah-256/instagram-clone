import firebase from "firebase";


  const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyC1s2qYsXqviP9DXiGfxzO6LXbX6L0z8YU",
    authDomain: "instagram-clone-ed7a6.firebaseapp.com",
    projectId: "instagram-clone-ed7a6",
    storageBucket: "instagram-clone-ed7a6.appspot.com",
    messagingSenderId: "721748681793",
    appId: "1:721748681793:web:4d95ffdbecef4d83e3d2c0",
    measurementId: "G-QDKEVJ9GFT"
  });

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export {db, auth, storage};