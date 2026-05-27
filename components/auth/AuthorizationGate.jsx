"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/client";

export default function AuthorizationGate({ children, requireAdmin = false, redirectTo = "/track" }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let unsub = () => {};

    async function checkUser(user) {
      if (!user) {
        setChecking(false);
        return;
      }

      try {
        const userRef = doc(db, "users", user.uid);
        const snapshot = await getDoc(userRef);
        const profile = snapshot.exists() ? snapshot.data() : {};
        const isAuthorized = profile.isAuthorized === true;
        const isAdmin = profile.isAdmin === true;

        const allowed = requireAdmin ? isAdmin : isAuthorized || isAdmin;
        if (!allowed) {
          router.replace(redirectTo);
          return;
        }
      } catch (err) {
        console.error("AuthorizationGate error:", err);
      } finally {
        setChecking(false);
      }
    }

    unsub = onAuthStateChanged(auth, checkUser);

    return () => unsub();
  }, [requireAdmin, redirectTo, router]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="rounded-3xl border border-[#E2E8F0] bg-white px-8 py-6 text-sm text-[#64748B] shadow-sm">
          Checking access…
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
