"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Loader2,
  Package,
  Plane,
  Shield,
} from "lucide-react";
import { signInUser, authErrorMessage } from "@/lib/firebase/auth";

// ─── Input Field ──────────────────────────────────────────────────────────────
function InputField({
  label,
  id,
  type = "text",
  placeholder,
  value,
  onChange,
  icon: Icon,
  rightElement,
  error,
  autoComplete,
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-semibold text-[#334155]">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
            <Icon size={16} className="text-[#94A3B8]" />
          </div>
        )}
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          className={`
            w-full py-3 rounded-xl border text-sm text-[#0F172A]
            placeholder:text-[#CBD5E1] bg-[#F8FAFC]
            focus:bg-white focus:outline-none focus:ring-2 transition-all
            ${Icon ? "pl-10" : "pl-4"}
            ${rightElement ? "pr-12" : "pr-4"}
            ${
              error
                ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                : "border-[#E2E8F0] focus:border-[#FFB800] focus:ring-[#FFB800]/20"
            }
          `}
        />
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>
      {error && (
        <p className="flex items-center gap-1.5 text-xs text-red-500 font-medium">
          <AlertCircle size={12} />
          {error}
        </p>
      )}
    </div>
  );
}

// ─── Social Button ────────────────────────────────────────────────────────────
function SocialButton({ icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        flex items-center justify-center gap-2.5
        w-full py-3 px-4 rounded-xl border border-[#E2E8F0]
        bg-white text-sm font-semibold text-[#334155]
        hover:bg-[#F8FAFC] hover:border-[#CBD5E1]
        active:scale-[0.98] transition-all duration-150
        shadow-sm
      "
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState("");
  const router = useRouter();

  const validate = () => {
    const newErrors = {};
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Please enter a valid email";
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGlobalError("");
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setGlobalError("");
    setLoading(true);

    try {
      await signInUser(email, password);
      router.push("/dashboard");
    } catch (err) {
      setGlobalError(authErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const STATS = [
    { icon: Package, label: "2.4M packages / month" },
    { icon: Plane, label: "180+ countries" },
    { icon: Shield, label: "99.97% on-time" },
  ];

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      {/* ── Left Panel (hidden on mobile) ───────────────────────── */}
      <div className="hidden lg:flex lg:w-[480px] xl:w-[560px] flex-col bg-[#0F172A] relative overflow-hidden flex-shrink-0">
        {/* Background decoration */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 20%, rgba(255,184,0,0.12) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(255,184,0,0.06) 0%, transparent 50%)
            `,
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.5) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.5) 1px, transparent 1px)
            `,
            backgroundSize: "48px 48px",
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full p-10 xl:p-14">
          {/* Logo */}
          <Logo size="md" theme="light" />

          {/* Main copy */}
          <div className="flex-1 flex flex-col justify-center space-y-8 mt-16">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFB800]/15 border border-[#FFB800]/25">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFB800] animate-pulse" />
                <span className="text-xs font-semibold text-[#FFB800] tracking-wide">
                  Live Operations
                </span>
              </div>
              <h2 className="text-3xl xl:text-4xl font-extrabold text-white leading-tight tracking-tight">
                Track. Ship.
                <br />
                <span className="text-[#FFB800]">Deliver.</span>
              </h2>
              <p className="text-[#64748B] text-base leading-relaxed max-w-xs">
                Welcome back to Yellowduck. Log in to manage your global
                shipments, track packages in real time, and access your
                dashboard.
              </p>
            </div>

            {/* Stats */}
            <div className="space-y-3">
              {STATS.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#FFB800]/10 flex items-center justify-center flex-shrink-0">
                    <Icon size={16} className="text-[#FFB800]" />
                  </div>
                  <span className="text-sm font-medium text-[#94A3B8]">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-[#1E293B] pt-6">
            <p className="text-xs text-[#475569]">
              © {new Date().getFullYear()} Yellowduck Logistics, Inc. — All
              rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* ── Right Panel (form) ───────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 overflow-y-auto">
        {/* Mobile logo */}
        <div className="lg:hidden mb-8">
          <Logo size="md" theme="dark" />
        </div>

        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
              Sign in to your account
            </h1>
            <p className="mt-2 text-sm text-[#64748B]">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/register"
                className="font-semibold text-[#FFB800] hover:text-[#F0AE00] transition-colors"
              >
                Create one for free
              </Link>
            </p>
          </div>

          {/* Social login */}
          <div className="space-y-3 mb-6">
            <SocialButton
              label="Continue with Google"
              icon={
                <svg width="18" height="18" viewBox="0 0 18 18">
                  <path
                    fill="#4285F4"
                    d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
                  />
                  <path
                    fill="#34A853"
                    d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
                  />
                  <path
                    fill="#EA4335"
                    d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
                  />
                </svg>
              }
            />
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E2E8F0]" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-[#F8FAFC] px-4 text-xs font-medium text-[#94A3B8] uppercase tracking-wider">
                or continue with email
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {globalError && (
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                <AlertCircle
                  size={16}
                  className="text-red-500 flex-shrink-0 mt-0.5"
                />
                <p className="text-sm text-red-600 font-medium">{globalError}</p>
              </div>
            )}

            <InputField
              label="Email address"
              id="email"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={Mail}
              error={errors.email}
              autoComplete="email"
            />

            <InputField
              label="Password"
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={Lock}
              error={errors.password}
              autoComplete="current-password"
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="p-1 text-[#94A3B8] hover:text-[#64748B] transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
            />

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded accent-[#FFB800] border-[#E2E8F0]"
                />
                <span className="text-sm text-[#64748B] font-medium">
                  Remember me
                </span>
              </label>
              <Link
                href="/auth/forgot-password"
                className="text-sm font-semibold text-[#FFB800] hover:text-[#F0AE00] transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="
                w-full flex items-center justify-center gap-2
                py-3.5 rounded-xl
                bg-[#FFB800] text-[#0F172A]
                font-bold text-sm
                hover:bg-[#F0AE00] active:scale-[0.98]
                disabled:opacity-60 disabled:cursor-not-allowed
                transition-all duration-150 shadow-sm
              "
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          {/* Track without account */}
          <div className="mt-8 p-4 bg-[#0F172A] rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#FFB800]/15 flex items-center justify-center flex-shrink-0">
                <Package size={16} className="text-[#FFB800]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white">
                  Just tracking a package?
                </p>
                <p className="text-xs text-[#64748B] mt-0.5">
                  No account needed for public tracking.
                </p>
              </div>
              <Link
                href="/track"
                className="flex-shrink-0 text-xs font-bold text-[#FFB800] hover:text-[#F0AE00] flex items-center gap-1 transition-colors"
              >
                Track <ArrowRight size={11} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}