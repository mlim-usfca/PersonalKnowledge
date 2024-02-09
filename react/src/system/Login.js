import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, signInWithEmailAndPassword } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import "./Login.css";
import { onAuthStateChanged, getIdToken, getIdTokenResult } from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";
import SignInGoogle from "./SignInGoogle";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const [authState, setAuthState] = useState({ status: 'loading' });
  const navigate = useNavigate();
  const database = getDatabase();
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async user => {
      if (user) {
        const token = await getIdToken(user);
        const idTokenResult = await getIdTokenResult(user);
        const hasuraClaim = idTokenResult.claims['https://hasura.io/jwt/claims'];

        if (hasuraClaim) {
          setAuthState({ status: 'in', user, token });
        } else {
          const metadataRef = ref(database, `metadata/${user.uid}/refreshTime`);

          onValue(metadataRef, async snapshot => {
            if (!snapshot.exists()) return;
            const newToken = await getIdToken(user, true);
            setAuthState({ status: 'in', user, token: newToken });
          });
        }
      } else {
        setAuthState({ status: 'out' });
      }
    });

    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, []);

  // Navigate to dashboard if user is i
  useEffect(() => {
    if (authState.status === 'in') {
      navigate("/dashboard");
    }
  }, [authState, navigate]);

  return (
    <div className="login">
      <div className="login__container">
        <input
          type="text"
          className="login__textBox"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail Address"
        />
        <input
          type="password"
          className="login__textBox"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button
          className="login__btn"
          onClick={() => signInWithEmailAndPassword(email, password)}
        >
          Login
        </button>
        <SignInGoogle></SignInGoogle>
        <div>
          <Link to="/reset">Forgot Password</Link>
        </div>
        <div>
          Don't have an account? <Link to="/register">Register</Link> now.
        </div>
      </div>
    </div>
  );
}
export default Login;