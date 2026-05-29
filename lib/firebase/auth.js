import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/client";

const AUTH_COOKIE_NAME = "ydk-auth-session";
const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function getSecureCookieFlag() {
  if (typeof window === "undefined") return "";
  return window.location.protocol === "https:" ? "; Secure" : "";
}

function setAuthCookie(token) {
  if (typeof document === "undefined") return;
  document.cookie = `${AUTH_COOKIE_NAME}=${encodeURIComponent(token)}; path=/; max-age=${AUTH_COOKIE_MAX_AGE}; SameSite=Lax${getSecureCookieFlag()}`;
}

function buildAuthErrorMessage(error) {
  if (!error?.code) return "Authentication failed. Please try again.";

  switch (error.code) {
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/user-not-found":
      return "No account found for that email.";
    case "auth/wrong-password":
      return "Incorrect password. Please try again.";
    case "auth/email-already-in-use":
      return "An account already exists with this email.";
    case "auth/weak-password":
      return "Password must be at least 6 characters.";
    case "auth/too-many-requests":
      return "Too many attempts. Please wait a moment and try again.";
    case "auth/user-disabled":
      return "This account has been disabled. Contact support if you need help.";
    default:
      return error.message || "Authentication failed. Please try again.";
  }
}

export async function signInUser(email, password) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  const token = await credential.user.getIdToken();
  setAuthCookie(token);
  return credential.user;
}

export async function registerUser({
  firstName,
  lastName,
  email,
  password,
  phone,
  company,
  accountType,
}) {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  const user = credential.user;

  await updateProfile(user, {
    displayName: `${firstName} ${lastName}`.trim(),
  });

  await sendEmailVerification(user);

  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    displayName: user.displayName,
    firstName,
    lastName,
    email,
    phone: phone || null,
    company: company || null,
    accountType,
    isAuthorized: false,
    isAdmin: false,
    emailVerified: user.emailVerified,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  const token = await user.getIdToken();
  setAuthCookie(token);
  return user;
}

export async function signOutUser() {
  await firebaseSignOut(auth);
  if (typeof document !== "undefined") {
    document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
  }
}

export function authErrorMessage(error) {
  return buildAuthErrorMessage(error);
}