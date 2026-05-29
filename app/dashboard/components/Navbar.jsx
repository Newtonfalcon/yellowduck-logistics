"use client";

import { useState, useEffect } from "react";
import { Bell, Search, ChevronDown, Plus, LogOut, Settings, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/client";

export default function Topbar({ title, subtitle }) {
  const [searchFocused, setSearchFocused] = useState(false);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);
      if (nextUser?.uid) {
        try {
          const snap = await getDoc(doc(db, "users", nextUser.uid));
          setProfile(snap.exists() ? snap.data() : null);
        } catch {
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const displayName = profile?.displayName || user?.displayName || user?.email?.split("@")[0] || "User";
  const firstName = displayName.split(" ")[0];
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "U";

  const handleSignOut = async () => {
    setMenuOpen(false);
    await signOut(auth);
    document.cookie = "ydk-auth-session=; path=/; max-age=0; SameSite=Lax";
    router.push("/auth/login");
  };

  return (
    <header className="h-16 bg-white border-b border-[#E2E8F0] flex items-center px-4 sm:px-6 gap-4 flex-shrink-0 relative z-20">

      {/* Left: Title */}
      <div className="hidden md:flex flex-col min-w-0 flex-shrink-0">
        {title && (
          <h1 className="text-base font-bold text-[#0F172A] leading-none truncate">{title}</h1>
        )}
        {subtitle && (
          <p className="text-xs text-[#94A3B8] mt-0.5 leading-none truncate">{subtitle}</p>
        )}
      </div>

      {/* Center: Search */}
      <div className={`flex-1 max-w-md ${title ? "md:ml-6" : ""}`}>
        <div className="relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search shipments, invoices…"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className={`
              w-full pl-9 pr-4 py-2 rounded-xl text-sm
              bg-[#F8FAFC] border transition-all
              text-[#0F172A] placeholder:text-[#94A3B8]
              focus:outline-none focus:bg-white
              ${searchFocused ? "border-[#FFB800] shadow-sm" : "border-[#E2E8F0]"}
            `}
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[#CBD5E1] font-mono hidden sm:block">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 flex-shrink-0 ml-auto">

        {/* Quick create */}
        <Link
          href="/dashboard/create"
          className="
            hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl
            bg-[#FFB800] text-[#0F172A] text-xs font-bold
            hover:bg-[#F0AE00] active:scale-[0.98] transition-all
          "
        >
          <Plus size={14} />
          New Shipment
        </Link>

        {/* Notifications */}
        <button className="relative p-2 rounded-xl text-[#64748B] hover:bg-[#F1F5F9] transition-colors">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FFB800] border-2 border-white" />
        </button>

        {/* User avatar + dropdown */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-[#F1F5F9] transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-[#FFB800] flex items-center justify-center text-[#0F172A] text-[11px] font-bold flex-shrink-0">
              {initials}
            </div>
            <span className="hidden sm:block text-sm font-medium text-[#0F172A]">{firstName}</span>
            <ChevronDown size={13} className="text-[#94A3B8] hidden sm:block" />
          </button>

          {/* Dropdown */}
          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setMenuOpen(false)}
                aria-hidden="true"
              />
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl border border-[#E2E8F0] shadow-lg z-20 overflow-hidden">
                {/* User info */}
                <div className="px-4 py-3 border-b border-[#F1F5F9]">
                  <p className="text-sm font-semibold text-[#0F172A] truncate">{displayName}</p>
                  <p className="text-xs text-[#64748B] truncate mt-0.5">{user?.email}</p>
                </div>

                <div className="py-1">
                  <Link
                    href="/dashboard/settings"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#334155] hover:bg-[#F8FAFC] transition-colors"
                  >
                    <Settings size={15} className="text-[#94A3B8]" />
                    Settings
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={15} />
                    Sign out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}