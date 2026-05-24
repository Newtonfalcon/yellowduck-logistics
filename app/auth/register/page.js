"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Building2,
  Phone,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Check,
  Globe,
  Package,
} from "lucide-react";
import { registerUser, authErrorMessage } from "@/lib/firebase/auth";

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
  hint,
  autoComplete,
  required,
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-semibold text-[#334155]">
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
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
      {hint && !error && (
        <p className="text-xs text-[#94A3B8]">{hint}</p>
      )}
    </div>
  );
}

// ─── Password Strength ────────────────────────────────────────────────────────
function PasswordStrength({ password }) {
  const checks = [
    { label: "At least 8 characters", pass: password.length >= 8 },
    { label: "Uppercase letter", pass: /[A-Z]/.test(password) },
    { label: "Number", pass: /[0-9]/.test(password) },
    { label: "Special character", pass: /[^A-Za-z0-9]/.test(password) },
  ];

  const passed = checks.filter((c) => c.pass).length;
  const strength = passed === 0 ? 0 : passed <= 1 ? 1 : passed <= 2 ? 2 : passed <= 3 ? 3 : 4;
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  const colors = ["", "bg-red-400", "bg-amber-400", "bg-yellow-400", "bg-green-500"];
  const textColors = ["", "text-red-500", "text-amber-500", "text-yellow-600", "text-green-600"];

  if (!password) return null;

  return (
    <div className="space-y-2 pt-1">
      <div className="flex items-center gap-2">
        <div className="flex gap-1 flex-1">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                i <= strength ? colors[strength] : "bg-[#E2E8F0]"
              }`}
            />
          ))}
        </div>
        {strength > 0 && (
          <span className={`text-xs font-semibold ${textColors[strength]}`}>
            {labels[strength]}
          </span>
        )}
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        {checks.map(({ label, pass }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div
              className={`w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                pass ? "bg-green-100" : "bg-[#F1F5F9]"
              }`}
            >
              {pass ? (
                <Check size={9} className="text-green-600" />
              ) : (
                <div className="w-1 h-1 rounded-full bg-[#CBD5E1]" />
              )}
            </div>
            <span
              className={`text-[11px] font-medium transition-colors ${
                pass ? "text-green-600" : "text-[#94A3B8]"
              }`}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Account Type Card ────────────────────────────────────────────────────────
function AccountTypeCard({ id, icon: Icon, title, description, selected, onChange }) {
  return (
    <label
      htmlFor={id}
      className={`
        flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer
        transition-all duration-150
        ${
          selected
            ? "border-[#FFB800] bg-[#FFF8E6]"
            : "border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] hover:border-[#CBD5E1]"
        }
      `}
    >
      <input
        id={id}
        type="radio"
        name="accountType"
        value={id}
        checked={selected}
        onChange={onChange}
        className="sr-only"
      />
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
          selected ? "bg-[#FFB800]/20" : "bg-[#F1F5F9]"
        }`}
      >
        <Icon size={17} className={selected ? "text-[#92670A]" : "text-[#64748B]"} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className={`text-sm font-bold ${selected ? "text-[#0F172A]" : "text-[#334155]"}`}>
            {title}
          </p>
          <div
            className={`w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
              selected ? "border-[#FFB800] bg-[#FFB800]" : "border-[#CBD5E1]"
            }`}
          >
            {selected && <Check size={9} className="text-[#0F172A]" />}
          </div>
        </div>
        <p className={`text-xs mt-0.5 leading-relaxed ${selected ? "text-[#92670A]" : "text-[#94A3B8]"}`}>
          {description}
        </p>
      </div>
    </label>
  );
}

// ─── Step Indicator ───────────────────────────────────────────────────────────
function StepIndicator({ currentStep, totalSteps }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
        <div key={step} className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              step < currentStep
                ? "bg-[#FFB800] text-[#0F172A]"
                : step === currentStep
                ? "bg-[#0F172A] text-white ring-4 ring-[#FFB800]/20"
                : "bg-[#F1F5F9] text-[#CBD5E1]"
            }`}
          >
            {step < currentStep ? <Check size={12} /> : step}
          </div>
          {step < totalSteps && (
            <div
              className={`h-0.5 w-8 rounded-full transition-all ${
                step < currentStep ? "bg-[#FFB800]" : "bg-[#E2E8F0]"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [accountType, setAccountType] = useState("personal");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState("");
  const [agreed, setAgreed] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    password: "",
    confirmPassword: "",
  });

  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const validateStep1 = () => {
    const errs = {};
    if (!form.firstName.trim()) errs.firstName = "First name is required";
    if (!form.lastName.trim()) errs.lastName = "Last name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Enter a valid email address";
    return errs;
  };

  const validateStep2 = () => {
    const errs = {};
    if (!form.password) errs.password = "Password is required";
    else if (form.password.length < 8) errs.password = "At least 8 characters";
    if (!form.confirmPassword) errs.confirmPassword = "Please confirm your password";
    else if (form.password !== form.confirmPassword)
      errs.confirmPassword = "Passwords do not match";
    if (!agreed) errs.terms = "You must accept the terms to continue";
    return errs;
  };

  const handleNext = () => {
    const errs = step === 1 ? validateStep1() : {};
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validateStep2();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setErrors({});
    setGlobalError("");
    setLoading(true);

    try {
      await registerUser({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
        phone: form.phone,
        company: form.company,
        accountType,
      });
      setDone(true);
    } catch (err) {
      setGlobalError(authErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // ── Success Screen ──────────────────────────────────────────────────────────
  if (done) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
        <div className="w-full max-w-md text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-green-50 border-4 border-green-100 flex items-center justify-center mx-auto">
            <CheckCircle2 size={38} className="text-green-500" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold text-[#0F172A]">
              Account Created!
            </h1>
            <p className="text-[#64748B] text-sm leading-relaxed">
              Welcome to Yellowduck, <strong className="text-[#0F172A]">{form.firstName}</strong>!
              A verification email has been sent to{" "}
              <strong className="text-[#0F172A]">{form.email}</strong>.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Link
              href="/dashboard"
              className="
                flex items-center justify-center gap-2
                w-full py-3.5 rounded-xl
                bg-[#FFB800] text-[#0F172A]
                font-bold text-sm
                hover:bg-[#F0AE00] transition-colors
              "
            >
              Go to Dashboard
              <ArrowRight size={15} />
            </Link>
            <Link
              href="/auth/login"
              className="text-sm text-[#64748B] hover:text-[#0F172A] transition-colors font-medium"
            >
              Sign in instead
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const ACCOUNT_TYPES = [
    {
      id: "personal",
      icon: User,
      title: "Personal Account",
      description: "For individual senders & receivers",
    },
    {
      id: "business",
      icon: Building2,
      title: "Business Account",
      description: "For teams, brands, and high volume",
    },
  ];

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      {/* ── Left Panel ───────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[480px] xl:w-[560px] flex-col bg-[#0F172A] relative overflow-hidden flex-shrink-0">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              radial-gradient(circle at 70% 30%, rgba(255,184,0,0.1) 0%, transparent 50%),
              radial-gradient(circle at 30% 80%, rgba(255,184,0,0.06) 0%, transparent 50%)
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

        <div className="relative z-10 flex flex-col h-full p-10 xl:p-14">
          <Logo size="md" theme="light" />

          <div className="flex-1 flex flex-col justify-center space-y-8 mt-16">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFB800]/15 border border-[#FFB800]/25">
                <Globe size={12} className="text-[#FFB800]" />
                <span className="text-xs font-semibold text-[#FFB800] tracking-wide">
                  Join 4,200+ businesses
                </span>
              </div>
              <h2 className="text-3xl xl:text-4xl font-extrabold text-white leading-tight tracking-tight">
                Ship smarter,
                <br />
                <span className="text-[#FFB800]">globally.</span>
              </h2>
              <p className="text-[#64748B] text-base leading-relaxed max-w-xs">
                Create your Yellowduck account and get access to real-time
                tracking, automated customs, and transparent pricing across 180+
                countries.
              </p>
            </div>

            {/* Feature list */}
            <div className="space-y-3">
              {[
                "Free to get started — no credit card needed",
                "Sub-second package tracking updates",
                "Automated customs documentation",
                "Express, standard, and economy rates",
                "SOC 2 Type II certified & secure",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#FFB800]/15 flex items-center justify-center flex-shrink-0">
                    <Check size={10} className="text-[#FFB800]" />
                  </div>
                  <span className="text-sm text-[#94A3B8]">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-[#1E293B] pt-6">
            <p className="text-xs text-[#475569]">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-[#FFB800] font-semibold hover:text-[#F0AE00] transition-colors"
              >
                Sign in →
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* ── Right Panel ──────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 overflow-y-auto">
        {/* Mobile logo */}
        <div className="lg:hidden mb-8">
          <Logo size="md" theme="dark" />
        </div>

        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
                Create account
              </h1>
              <StepIndicator currentStep={step} totalSteps={2} />
            </div>
            <p className="text-sm text-[#64748B]">
              {step === 1
                ? "Step 1 of 2 — Your details"
                : "Step 2 of 2 — Set your password"}
            </p>
          </div>

          {/* ── STEP 1 ── */}
          {step === 1 && (
            <div className="space-y-5">
              {/* Account type */}
              <div className="space-y-2">
                <p className="text-sm font-semibold text-[#334155]">
                  Account type
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {ACCOUNT_TYPES.map((type) => (
                    <AccountTypeCard
                      key={type.id}
                      {...type}
                      selected={accountType === type.id}
                      onChange={() => setAccountType(type.id)}
                    />
                  ))}
                </div>
              </div>

              {/* Name row */}
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="First name"
                  id="firstName"
                  placeholder="Jane"
                  value={form.firstName}
                  onChange={set("firstName")}
                  icon={User}
                  error={errors.firstName}
                  autoComplete="given-name"
                  required
                />
                <InputField
                  label="Last name"
                  id="lastName"
                  placeholder="Doe"
                  value={form.lastName}
                  onChange={set("lastName")}
                  error={errors.lastName}
                  autoComplete="family-name"
                  required
                />
              </div>

              <InputField
                label="Email address"
                id="email"
                type="email"
                placeholder="you@company.com"
                value={form.email}
                onChange={set("email")}
                icon={Mail}
                error={errors.email}
                autoComplete="email"
                required
              />

              <InputField
                label="Phone number"
                id="phone"
                type="tel"
                placeholder="+234 800 000 0000"
                value={form.phone}
                onChange={set("phone")}
                icon={Phone}
                hint="Optional — used for shipment SMS alerts"
                error={errors.phone}
                autoComplete="tel"
              />

              {accountType === "business" && (
                <InputField
                  label="Company name"
                  id="company"
                  placeholder="Acme Corp"
                  value={form.company}
                  onChange={set("company")}
                  icon={Building2}
                  error={errors.company}
                  autoComplete="organization"
                />
              )}

              <button
                type="button"
                onClick={handleNext}
                className="
                  w-full flex items-center justify-center gap-2
                  py-3.5 rounded-xl
                  bg-[#FFB800] text-[#0F172A]
                  font-bold text-sm
                  hover:bg-[#F0AE00] active:scale-[0.98]
                  transition-all duration-150 shadow-sm
                "
              >
                Continue
                <ArrowRight size={15} />
              </button>

              <p className="text-center text-sm text-[#64748B]">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="font-semibold text-[#FFB800] hover:text-[#F0AE00] transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          )}

          {/* ── STEP 2 ── */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-5">
              {globalError && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {globalError}
                </div>
              )}
              {/* Back link */}
              <button
                type="button"
                onClick={() => { setStep(1); setErrors({}); }}
                className="flex items-center gap-1.5 text-sm font-medium text-[#64748B] hover:text-[#0F172A] transition-colors -mt-2 mb-2"
              >
                ← Back to details
              </button>

              {/* Summary pill */}
              <div className="flex items-center gap-3 p-3.5 bg-white border border-[#E2E8F0] rounded-xl">
                <div className="w-9 h-9 rounded-full bg-[#FFB800] flex items-center justify-center text-[#0F172A] font-bold text-sm flex-shrink-0">
                  {form.firstName.charAt(0).toUpperCase() || "?"}
                  {form.lastName.charAt(0).toUpperCase() || ""}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#0F172A] truncate">
                    {form.firstName} {form.lastName}
                  </p>
                  <p className="text-xs text-[#64748B] truncate">{form.email}</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFB800]/15 text-[#92670A] capitalize">
                  {accountType}
                </span>
              </div>

              <div>
                <InputField
                  label="Password"
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={set("password")}
                  icon={Lock}
                  error={errors.password}
                  autoComplete="new-password"
                  required
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
                <PasswordStrength password={form.password} />
              </div>

              <InputField
                label="Confirm password"
                id="confirmPassword"
                type={showConfirm ? "text" : "password"}
                placeholder="••••••••"
                value={form.confirmPassword}
                onChange={set("confirmPassword")}
                icon={Lock}
                error={errors.confirmPassword}
                autoComplete="new-password"
                required
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="p-1 text-[#94A3B8] hover:text-[#64748B] transition-colors"
                    tabIndex={-1}
                  >
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
              />

              {/* Terms */}
              <div className="space-y-1">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded accent-[#FFB800] border-[#E2E8F0] flex-shrink-0"
                  />
                  <span className="text-sm text-[#64748B] leading-relaxed">
                    I agree to Yellowduck&apos;s{" "}
                    <Link
                      href="/terms"
                      className="font-semibold text-[#FFB800] hover:text-[#F0AE00] transition-colors"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      className="font-semibold text-[#FFB800] hover:text-[#F0AE00] transition-colors"
                    >
                      Privacy Policy
                    </Link>
                  </span>
                </label>
                {errors.terms && (
                  <p className="flex items-center gap-1.5 text-xs text-red-500 font-medium ml-6">
                    <AlertCircle size={12} />
                    {errors.terms}
                  </p>
                )}
              </div>

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
                    Creating account…
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight size={15} />
                  </>
                )}
              </button>

              {/* Package promo */}
              <div className="flex items-center gap-3 p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
                <Package size={16} className="text-[#FFB800] flex-shrink-0" />
                <p className="text-xs text-[#64748B]">
                  Your first shipment is{" "}
                  <strong className="text-[#0F172A]">free</strong> when you sign
                  up today.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}