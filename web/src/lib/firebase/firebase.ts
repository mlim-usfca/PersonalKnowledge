/* eslint-disable no-console */
import { initializeApp, getApps } from "firebase/app";
import { getAuth, signInWithCustomToken } from "firebase/auth";

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const FIREBASE_APP =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const AUTH = getAuth(FIREBASE_APP);

export async function getAuthenticatedAppForUser(session = null) {
  if (typeof window !== "undefined") {
    console.log("client: ", FIREBASE_APP);
    return { app: FIREBASE_APP, user: AUTH.currentUser?.toJSON() };
  }

  const { initializeApp: initializeAdminApp, getApps: getAdminApps } =
    await import("firebase-admin/app");

  const { getAuth: getAdminAuth } = await import("firebase-admin/auth");

  const { credential } = await import("firebase-admin");

  const ADMIN_APP_NAME = "firebase-frameworks";
  const adminApp =
    getAdminApps().find((it) => it.name === ADMIN_APP_NAME) ||
    initializeAdminApp(
      {
        credential: credential.applicationDefault(),
      },
      ADMIN_APP_NAME
    );

  const adminAuth = getAdminAuth(adminApp);
  const noSessionReturn = { app: null, currentUser: null };

  if (!session) {
    // @ts-ignore
    session = await getAppRouterSession();

    if (!session) return noSessionReturn;
  }

  const decodedIdToken = await adminAuth.verifySessionCookie(session);

  const app = initializeAuthenticatedApp(decodedIdToken.uid);
  const auth = getAuth(app);

  const isRevoked = !(await adminAuth
    .verifySessionCookie(session, true)
    .catch((e) => console.error(e.message)));
  if (isRevoked) return noSessionReturn;

  if (auth.currentUser?.uid !== decodedIdToken.uid) {
    const customToken = await adminAuth
      .createCustomToken(decodedIdToken.uid)
      .catch((e) => console.error(e.message));

    if (!customToken) return noSessionReturn;

    await signInWithCustomToken(auth, customToken);
  }
  console.log("server: ", app);
  return { app, currentUser: auth.currentUser };
}

async function getAppRouterSession() {
  const { cookies } = await import("next/headers");
  try {
    return cookies().get("__session")?.value;
  } catch (error) {
    return undefined;
  }
}

function initializeAuthenticatedApp(uid: string) {
  const random = Math.random().toString(36).split(".")[1];
  const appName = `authenticated-context:${uid}:${random}`;

  const app = initializeApp(firebaseConfig, appName);

  return app;
}
