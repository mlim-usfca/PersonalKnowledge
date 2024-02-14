/* eslint-disable no-console */
import { AUTH } from "@/lib/firebase/firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged as _onAuthStateChanged,
} from "firebase/auth";

export function onAuthStateChanged(cb) {
  return _onAuthStateChanged(AUTH, cb);
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();

  try {
    await signInWithPopup(AUTH, provider);
  } catch (error) {
    console.error("Error signing in with Google", error);
  }
}

export async function signOut() {
  try {
    return AUTH.signOut();
  } catch (error) {
    console.error("Error signing out with Google", error);
  }
}
