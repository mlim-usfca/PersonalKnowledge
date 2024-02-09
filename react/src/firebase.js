import { initializeApp } from "firebase/app";
import React, { useState, useEffect } from 'react';
import {
    GoogleAuthProvider,
    getAuth,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut,
    onAuthStateChanged,
    getIdToken,
    getIdTokenResult,
} from "firebase/auth";
import {
    getFirestore,
    query,
    getDocs,
    collection,
    where,
    addDoc,
} from "firebase/firestore";
import { getDatabase, ref, onValue } from "firebase/database";
import UseAuth from './system/UseAuth'; // Adjust the import path as necessary


const firebaseConfig = {
  apiKey: "AIzaSyDgz-lZbYgTFROMpyV6QDuJY-hiY4KBmjQ",
  authDomain: "dragonai-auth.firebaseapp.com",
  projectId: "dragonai-auth",
  storageBucket: "dragonai-auth.appspot.com",
  messagingSenderId: "77005197985",
  appId: "1:77005197985:web:c1a370d7c5050c4e9256e0"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();

const logInWithEmailAndPassword = async (email, password) => {
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
};

const registerWithEmailAndPassword = async (name, email, password) => {
    try {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const user = res.user;
        await addDoc(collection(db, "users"), {
        uid: user.uid,
        name,
        authProvider: "local",
        email,
        });
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
};

const sendPasswordReset = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset link sent!");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
};

const logout = () => {
    signOut(auth);
};

// Export the constants
export { auth, signInWithEmailAndPassword, db, logout, registerWithEmailAndPassword, sendPasswordResetEmail };