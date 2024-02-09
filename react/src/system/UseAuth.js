// useAuth.js
import { useState, useEffect } from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, getIdToken, getIdTokenResult } from 'firebase/auth';
import { getDatabase, ref, onValue } from 'firebase/database';
import {
  getFirestore,
  query,
  getDocs,
  collection,
  where,
  addDoc,
} from "firebase/firestore";
import app from "../App"


const UseAuth = () => {
  const [authState, setAuthState] = useState({ status: 'loading' });
  const auth = getAuth();
  const database = getDatabase(); // Make sure Firebase is initialized with the Database URL
  const db = getFirestore(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async user => {
      if (user) {
        const token = await getIdToken(user);
        const idTokenResult = await getIdTokenResult(user);
        console.log("ID Token Claims:", idTokenResult.claims); // Debugging line
        const hasuraClaim = idTokenResult.claims['https://hasura.io/jwt/claims'];

        if (hasuraClaim) {
          console.log("Hasura claim found", hasuraClaim); // Debugging line
          setAuthState({ status: 'in', user, token });
        } else {
          console.log("Hasura claim not found, listening for token refresh"); // Debugging line
          const metadataRef = ref(database, `metadata/${user.uid}/refreshTime`);

          onValue(metadataRef, async snapshot => {
            if (!snapshot.exists()) return;
            const newToken = await getIdToken(user, true);
            console.log("Token refreshed", newToken); // Debugging line
            setAuthState({ status: 'in', user, token: newToken });
          });
        }
      } else {
        setAuthState({ status: 'out' });
      }
    });

    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, [auth, database]);

  const signInWithGoogle = async () => {
    const googleProvider = new GoogleAuthProvider();
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const user = res.user;
      const q = query(collection(db, "users"), where("uid", "==", user.uid));
      const docs = await getDocs(q);
      if (docs.docs.length === 0) {
        await addDoc(collection(db, "users"), {
          uid: user.uid,
          name: user.displayName,
          authProvider: "google",
          email: user.email,
        });
      }
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return { authState, signInWithGoogle };
};

export default UseAuth;
