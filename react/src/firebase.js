import { initializeApp } from "firebase/app";

import {
    GoogleAuthProvider,
    getAuth,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut,
} from "firebase/auth";
import {
    getFirestore,
    query,
    getDocs,
    collection,
    where,
    addDoc,
} from "firebase/firestore";

const firebaseConfig = {
    // content here is shared on slace
};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
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
      insertUser(user.email, user.uid);
    }
  } catch (err) {
    console.error(err); // missing or insufficient permission
    alert(err.message);
  }
};

const logInWithEmailAndPassword = async (email, password) => {
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
};


async function insertUser(email, id) {
  const admin_secret = "";
  const url = "https://dragonai.hasura.app/v1/graphql";
  const query = `
    mutation InsertUsers($email: String, $id: String) {
      insert_users(objects: {email: $email, id: $id}) {
        affected_rows
        returning {
          email
          id
        }
      }
    }
  `;

  const variables = { email: email, id: id };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-hasura-admin-secret": admin_secret,
      },
      body: JSON.stringify({
        query: query,
        variables: variables,
      }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }

    const jsonResponse = await response.json();
    if (jsonResponse.errors) {
      console.error('GraphQL errors:', jsonResponse.errors);
    } else {
      console.log('Success:', jsonResponse.data);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

const registerWithEmailAndPassword = async (name, email, password) => {
    try {
        createUserWithEmailAndPassword(auth, email, password)
        .then((res) => {
          insertUser(email, name).then(() => console.log("Sent Hasura API"));
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

export { app, auth, signInWithEmailAndPassword, signInWithGoogle, db, logout, registerWithEmailAndPassword, sendPasswordResetEmail };

