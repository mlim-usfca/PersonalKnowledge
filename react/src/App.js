import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./system/Login";
import Register from "./system/Register";
import Reset from "./system/Reset";
import Dashboard from "./system/Dashboard";
import { auth, app } from './firebase';
import React, { useEffect, useState } from "react";
import { getDatabase, ref, onValue } from 'firebase/database';

function App() {
  const [authState, setAuthState] = useState({ status: "loading" });

  useEffect(() => {
    return auth.onAuthStateChanged(async user => {
      if (user) {
        const token = await user.getIdToken();
        const idTokenResult = await user.getIdTokenResult();
        const hasuraClaim = idTokenResult.claims["https://hasura.io/jwt/claims"];

        if (hasuraClaim) {
          setAuthState({ status: "in", user, token });
        } else {
          // Check if refresh is required.
          const database = getDatabase(app); 
          console.log("Hasura claim not found, listening for token refresh"); // Debugging line
          const metadataRef = ref(database, `metadata/${user.uid}/refreshTime`);

          onValue(metadataRef, async snapshot => {
            if (!snapshot.exists()) return;
            const idTokenResult = await user.getIdTokenResult();
            const hasuraClaim = idTokenResult.claims["https://hasura.io/jwt/claims"];
            console.log({hasuraClaim})
          });
        }
      } else {
        setAuthState({ status: "out" });
      }
    });
  }, []);

  return (
    <div className="app">
      <Router>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/reset" element={<Reset />} />
          <Route exact path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </div>
  );
}
export default App;