"use client";

/**
 * app/dashboard/settings/page.js — User Profile Settings
 * ────────────────────────────────────────────────────────
 * Fetches the authenticated user's Firestore profile and allows
 * them to update display name, phone, company, and bio.
 * Also provides sign-out and account info display.
 */

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/nav/Sidebar";
import Topbar from "@/app/dashboard/components/Navbar";
import { onAuthStateChanged, signOut, updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { getUserById, updateUserProfile } from "@/services/user.service";
import {
  User, Mail, Phone, Building2, FileText, Save,
  LogOut, Loader2, CheckCircle2, AlertCircle,
  ShieldCheck, ShieldOff, RefreshCw, Camera,
} from "lucide-react";

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function Skeleton({ className = "" }) {
  return <div className={`animate-pulse bg-[#E2E8F0] rounded-xl ${className}`} />;
}

// ─── Section Card ─────────────────────────────────────────────────────────────
function SectionCard({ title, description, children }) {
  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-[#F1F5F9]">
        <h3 className="text-sm font-bold text-[#0F172A]">{title}</h3>
        {description && <p className="text-xs text-[#64748B] mt-0.5">{description}</p>}
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

// ─── Input Field ──────────────────────────────────────────────────────────────
function Field({ label, icon: Icon, type = "text", name, value, onChange, placeholder, hint, readOnly = false }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-[#334155]">{label}</label>
      <div className="relative">
        {Icon && (
          <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none" />
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          readOnly={readOnly}
          className={`
            w-full ${Icon ? "pl-10" : "pl-4"} pr-4 py-3 rounded-xl border text-sm transition-all
            ${readOnly
              ? "border-[#E2E8F0] bg-[#F8FAFC] text-[#94A3B8] cursor-not-allowed"
              : "border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A] focus:bg-white focus:outline-none focus:border-[#FFB800] focus:ring-2 focus:ring-[#FFB800]/20"
            }
          `}
        />
      </div>
      {hint && <p className="text-[11px] text-[#94A3B8]">{hint}</p>}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function SettingsPage() {
  const router = useRouter();
  const [user,    setUser]    = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [form, setForm] = useState({
    firstName: "", lastName: "", phone: "",
    company: "", bio: "",
  });

  // ── Load user + profile ───────────────────────────────────────────────────
  const loadProfile = useCallback(async (uid) => {
    try {
      const data = await getUserById(uid);
      setProfile(data);
      if (data) {
        setForm({
          firstName: data.firstName || "",
          lastName:  data.lastName  || "",
          phone:     data.phone     || "",
          company:   data.company   || "",
          bio:       data.bio       || "",
        });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Failed to load profile." });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      if (nextUser) {
        loadProfile(nextUser.uid);
      } else {
        setLoading(false);
      }
    });
    return () => unsub();
  }, [loadProfile]);

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  // ── Save profile ──────────────────────────────────────────────────────────
  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setMessage({ type: "", text: "" });
    try {
      await updateUserProfile(user.uid, form);
      // Also update Firebase Auth displayName
      const displayName = `${form.firstName} ${form.lastName}`.trim();
      if (displayName) await updateProfile(user, { displayName });
      setMessage({ type: "success", text: "Profile updated successfully." });
      loadProfile(user.uid);
    } catch (err) {
      setMessage({ type: "error", text: err?.message || "Failed to save profile." });
    } finally {
      setSaving(false);
    }
  };

  // ── Sign out ──────────────────────────────────────────────────────────────
  const handleSignOut = async () => {
    setSigningOut(true);
    await signOut(auth);
    document.cookie = "ydk-auth-session=; path=/; max-age=0; SameSite=Lax";
    document.cookie = "ydk-user-role=; path=/; max-age=0; SameSite=Lax";
    router.push("/auth/login");
  };

  const initials = ((form.firstName || "") + " " + (form.lastName || ""))
    .split(" ").filter(Boolean).map((p) => p[0]).join("").slice(0, 2).toUpperCase() || "U";

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Topbar title="Settings" subtitle="Manage your profile and preferences" />

        <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
          <div className="max-w-3xl mx-auto space-y-6">

            {/* ── Page header ─────────────────────────────────── */}
            <div>
              <h2 className="text-xl font-extrabold text-[#0F172A]">Account Settings</h2>
              <p className="text-sm text-[#64748B] mt-0.5">
                Update your personal information and account preferences.
              </p>
            </div>

            {/* ── Avatar + Name summary ────────────────────────── */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 flex flex-col sm:flex-row items-center gap-5">
              <div className="relative flex-shrink-0">
                <div className="w-20 h-20 rounded-full bg-[#FFB800] flex items-center justify-center text-[#0F172A] text-2xl font-extrabold">
                  {loading ? "…" : initials}
                </div>
                <button
                  title="Change avatar (coming soon)"
                  className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-white border-2 border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:text-[#FFB800] transition-colors"
                >
                  <Camera size={13} />
                </button>
              </div>
              <div className="text-center sm:text-left">
                {loading ? (
                  <Skeleton className="h-6 w-40 mb-2" />
                ) : (
                  <p className="text-lg font-extrabold text-[#0F172A]">
                    {form.firstName || form.lastName
                      ? `${form.firstName} ${form.lastName}`.trim()
                      : "Your Name"}
                  </p>
                )}
                {loading ? (
                  <Skeleton className="h-4 w-48" />
                ) : (
                  <p className="text-sm text-[#64748B]">{user?.email}</p>
                )}
                <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-2">
                  {profile?.isAdmin && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full">
                      <ShieldCheck size={10} /> Admin
                    </span>
                  )}
                  {profile?.isAuthorized ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                      <CheckCircle2 size={10} /> Authorized
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                      <ShieldOff size={10} /> Pending Authorization
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* ── Profile Form ─────────────────────────────────── */}
            <SectionCard
              title="Personal Information"
              description="This information is displayed on your shipments and invoices."
            >
              {loading ? (
                <div className="space-y-4">
                  {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
                </div>
              ) : (
                <form onSubmit={handleSave} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="First Name" icon={User} name="firstName" value={form.firstName} onChange={handleChange} placeholder="Jane" />
                    <Field label="Last Name"  name="lastName"  value={form.lastName}  onChange={handleChange} placeholder="Doe" />
                  </div>
                  <Field label="Phone Number" icon={Phone} type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+234 800 000 0000" hint="Used for shipment SMS alerts." />
                  <Field label="Company" icon={Building2} name="company" value={form.company} onChange={handleChange} placeholder="Acme Corp" hint="Optional — appears on commercial invoices." />
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-[#334155]">Bio</label>
                    <textarea
                      name="bio"
                      rows={3}
                      value={form.bio}
                      onChange={handleChange}
                      placeholder="A short description about yourself or your business…"
                      className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] text-sm bg-[#F8FAFC] text-[#0F172A] focus:bg-white focus:outline-none focus:border-[#FFB800] focus:ring-2 focus:ring-[#FFB800]/20 transition-all resize-none"
                    />
                  </div>

                  {/* Message */}
                  {message.text && (
                    <div className={`flex items-center gap-2.5 p-3.5 rounded-xl text-sm border ${message.type === "success" ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"}`}>
                      {message.type === "success" ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
                      {message.text}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#FFB800] text-[#0F172A] font-bold text-sm hover:bg-[#F0AE00] disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-sm"
                  >
                    {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                    {saving ? "Saving…" : "Save Changes"}
                  </button>
                </form>
              )}
            </SectionCard>

            {/* ── Account Details (read-only) ───────────────────── */}
            <SectionCard title="Account Details" description="These fields are managed by the system.">
              <div className="space-y-4">
                <Field label="Email Address" icon={Mail} value={user?.email || ""} readOnly hint="Email cannot be changed. Contact support if needed." />
                <Field label="Account Type" value={profile?.accountType || "personal"} readOnly />
                <Field label="Member Since"
                  value={profile?.createdAt
                    ? (typeof profile.createdAt.toDate === "function"
                        ? profile.createdAt.toDate()
                        : new Date(profile.createdAt)
                      ).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
                    : "—"}
                  readOnly
                />
              </div>
            </SectionCard>

            {/* ── Danger Zone ──────────────────────────────────── */}
            <SectionCard title="Session">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-[#0F172A]">Sign out of your account</p>
                  <p className="text-xs text-[#64748B] mt-0.5">You'll be redirected to the login page.</p>
                </div>
                <button
                  onClick={handleSignOut}
                  disabled={signingOut}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-red-200 text-sm font-bold text-red-600 hover:bg-red-50 disabled:opacity-60 transition-colors flex-shrink-0"
                >
                  {signingOut ? <Loader2 size={14} className="animate-spin" /> : <LogOut size={14} />}
                  {signingOut ? "Signing out…" : "Sign Out"}
                </button>
              </div>
            </SectionCard>

          </div>
        </main>
      </div>
    </div>
  );
}