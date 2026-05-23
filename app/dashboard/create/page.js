"use client";

import { useState } from "react";
import Sidebar from "@/components/nav/Sidebar";
import Topbar from "@/app/dashboard/components/Navbar";
import {
  User,
  MapPin,
  Package,
  Shield,
  DollarSign,
  CreditCard,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Check,
  Plane,
  AlertCircle,
} from "lucide-react";

// ─── Wizard Steps Config ──────────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: "Sender",     icon: User,         shortLabel: "Sender" },
  { id: 2, label: "Recipient",  icon: MapPin,        shortLabel: "Recipient" },
  { id: 3, label: "Package",    icon: Package,       shortLabel: "Package" },
  { id: 4, label: "Customs",    icon: Shield,        shortLabel: "Customs" },
  { id: 5, label: "Pricing",    icon: DollarSign,    shortLabel: "Pricing" },
  { id: 6, label: "Payment",    icon: CreditCard,    shortLabel: "Payment" },
  { id: 7, label: "Confirm",    icon: CheckCircle2,  shortLabel: "Confirm" },
];

// ─── Shared Field Components ──────────────────────────────────────────────────
function Label({ children, required }) {
  return (
    <label className="block text-xs font-semibold text-[#334155] mb-1.5">
      {children}
      {required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
  );
}

function Input({ placeholder, type = "text", ...props }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className="
        w-full px-4 py-3 rounded-xl border border-[#E2E8F0]
        text-sm text-[#0F172A] placeholder:text-[#CBD5E1]
        bg-[#F8FAFC] focus:bg-white focus:outline-none
        focus:border-[#FFB800] focus:ring-2 focus:ring-[#FFB800]/20
        transition-all
      "
      {...props}
    />
  );
}

function Select({ children, ...props }) {
  return (
    <select
      className="
        w-full px-4 py-3 rounded-xl border border-[#E2E8F0]
        text-sm text-[#0F172A] bg-[#F8FAFC]
        focus:bg-white focus:outline-none focus:border-[#FFB800] focus:ring-2 focus:ring-[#FFB800]/20
        transition-all appearance-none
      "
      {...props}
    >
      {children}
    </select>
  );
}

function FieldGroup({ children }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>;
}

function SectionTitle({ children }) {
  return (
    <h3 className="text-xs font-bold text-[#94A3B8] uppercase tracking-widest mb-4 mt-6 first:mt-0">
      {children}
    </h3>
  );
}

// ─── Step 1: Sender Info ──────────────────────────────────────────────────────
function StepSender() {
  return (
    <div className="space-y-4">
      <SectionTitle>Sender Information</SectionTitle>
      <FieldGroup>
        <div>
          <Label required>First Name</Label>
          <Input placeholder="Jane" />
        </div>
        <div>
          <Label required>Last Name</Label>
          <Input placeholder="Doe" />
        </div>
      </FieldGroup>
      <div>
        <Label required>Company (optional)</Label>
        <Input placeholder="Acme Corp" />
      </div>
      <div>
        <Label required>Email Address</Label>
        <Input type="email" placeholder="jane@acmecorp.com" />
      </div>
      <div>
        <Label required>Phone Number</Label>
        <Input type="tel" placeholder="+234 800 000 0000" />
      </div>
      <SectionTitle>Pickup Address</SectionTitle>
      <div>
        <Label required>Street Address</Label>
        <Input placeholder="15 Victoria Island Blvd" />
      </div>
      <FieldGroup>
        <div>
          <Label required>City</Label>
          <Input placeholder="Lagos" />
        </div>
        <div>
          <Label required>State / Province</Label>
          <Input placeholder="Lagos State" />
        </div>
      </FieldGroup>
      <FieldGroup>
        <div>
          <Label required>Postal Code</Label>
          <Input placeholder="101001" />
        </div>
        <div>
          <Label required>Country</Label>
          <Select>
            <option value="">Select country…</option>
            <option value="NG">Nigeria</option>
            <option value="GB">United Kingdom</option>
            <option value="US">United States</option>
            <option value="AE">UAE</option>
          </Select>
        </div>
      </FieldGroup>
    </div>
  );
}

// ─── Step 2: Recipient Info ───────────────────────────────────────────────────
function StepRecipient() {
  return (
    <div className="space-y-4">
      <SectionTitle>Recipient Information</SectionTitle>
      <FieldGroup>
        <div>
          <Label required>First Name</Label>
          <Input placeholder="Marcus" />
        </div>
        <div>
          <Label required>Last Name</Label>
          <Input placeholder="Webb" />
        </div>
      </FieldGroup>
      <div>
        <Label>Company (optional)</Label>
        <Input placeholder="Webb Ventures LLC" />
      </div>
      <div>
        <Label required>Email Address</Label>
        <Input type="email" placeholder="marcus@example.com" />
      </div>
      <div>
        <Label required>Phone Number</Label>
        <Input type="tel" placeholder="+1 212 555 0192" />
      </div>
      <SectionTitle>Delivery Address</SectionTitle>
      <div>
        <Label required>Street Address Line 1</Label>
        <Input placeholder="350 5th Avenue" />
      </div>
      <div>
        <Label>Street Address Line 2</Label>
        <Input placeholder="Suite 1200" />
      </div>
      <FieldGroup>
        <div>
          <Label required>City</Label>
          <Input placeholder="New York" />
        </div>
        <div>
          <Label required>State / Province</Label>
          <Input placeholder="NY" />
        </div>
      </FieldGroup>
      <FieldGroup>
        <div>
          <Label required>ZIP / Postal Code</Label>
          <Input placeholder="10118" />
        </div>
        <div>
          <Label required>Country</Label>
          <Select>
            <option value="">Select country…</option>
            <option value="US">United States</option>
            <option value="GB">United Kingdom</option>
            <option value="NG">Nigeria</option>
            <option value="AE">UAE</option>
          </Select>
        </div>
      </FieldGroup>
      <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl flex gap-2">
        <AlertCircle size={14} className="text-blue-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-blue-700">
          We'll send the recipient an SMS + email with live tracking once the shipment is booked.
        </p>
      </div>
    </div>
  );
}

// ─── Step 3: Package Details ──────────────────────────────────────────────────
function StepPackage() {
  return (
    <div className="space-y-4">
      <SectionTitle>Package Dimensions</SectionTitle>
      <FieldGroup>
        <div>
          <Label required>Weight (kg)</Label>
          <Input type="number" placeholder="3.4" min="0.1" step="0.1" />
        </div>
        <div>
          <Label>Volumetric Weight</Label>
          <div className="px-4 py-3 rounded-xl border border-[#E2E8F0] bg-[#F1F5F9] text-sm text-[#94A3B8]">
            Auto-calculated
          </div>
        </div>
      </FieldGroup>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label required>Length (cm)</Label>
          <Input type="number" placeholder="28" />
        </div>
        <div>
          <Label required>Width (cm)</Label>
          <Input type="number" placeholder="18" />
        </div>
        <div>
          <Label required>Height (cm)</Label>
          <Input type="number" placeholder="12" />
        </div>
      </div>
      <SectionTitle>Package Type & Contents</SectionTitle>
      <div>
        <Label required>Package Type</Label>
        <Select>
          <option value="">Select type…</option>
          <option>Parcel / Box</option>
          <option>Document Envelope</option>
          <option>Pallet</option>
          <option>Tube</option>
          <option>Fragile / Crated</option>
        </Select>
      </div>
      <div>
        <Label required>Contents Description</Label>
        <textarea
          rows={3}
          placeholder="e.g. Electronic components, laptop accessories — be specific for customs"
          className="
            w-full px-4 py-3 rounded-xl border border-[#E2E8F0]
            text-sm text-[#0F172A] placeholder:text-[#CBD5E1] bg-[#F8FAFC]
            focus:bg-white focus:outline-none focus:border-[#FFB800] focus:ring-2 focus:ring-[#FFB800]/20
            transition-all resize-none
          "
        />
      </div>
      <SectionTitle>Special Handling</SectionTitle>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {["Fragile", "Keep Upright", "Temperature Controlled", "Hazardous — IATA Class B"].map((opt) => (
          <label
            key={opt}
            className="flex items-center gap-3 px-4 py-3 border border-[#E2E8F0] rounded-xl cursor-pointer hover:bg-[#F8FAFC] transition-colors"
          >
            <input type="checkbox" className="rounded w-4 h-4 accent-[#FFB800]" />
            <span className="text-sm text-[#334155] font-medium">{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

// ─── Step 4: Customs Info ─────────────────────────────────────────────────────
function StepCustoms() {
  return (
    <div className="space-y-4">
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex gap-3">
        <Shield size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-amber-800">Customs Declaration Required</p>
          <p className="text-xs text-amber-700 mt-1 leading-relaxed">
            All international shipments require an accurate customs declaration. Incorrect or missing information may result in delays, fines, or seizure.
          </p>
        </div>
      </div>
      <SectionTitle>Declared Value & HS Code</SectionTitle>
      <FieldGroup>
        <div>
          <Label required>Declared Value (USD)</Label>
          <Input type="number" placeholder="420.00" min="0" step="0.01" />
        </div>
        <div>
          <Label>HS / HTS Code</Label>
          <Input placeholder="8471.30" />
        </div>
      </FieldGroup>
      <div>
        <Label required>Country of Origin</Label>
        <Select>
          <option value="">Select country…</option>
          <option value="NG">Nigeria</option>
          <option value="CN">China</option>
          <option value="US">United States</option>
          <option value="GB">United Kingdom</option>
        </Select>
      </div>
      <SectionTitle>Shipment Purpose</SectionTitle>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {["Commercial Sale", "Gift", "Personal Use / Return", "Repair / Warranty", "Sample / No Commercial Value"].map(
          (purpose) => (
            <label
              key={purpose}
              className="flex items-center gap-3 px-4 py-3 border border-[#E2E8F0] rounded-xl cursor-pointer hover:bg-[#F8FAFC] transition-colors"
            >
              <input type="radio" name="purpose" className="w-4 h-4 accent-[#FFB800]" />
              <span className="text-sm text-[#334155] font-medium">{purpose}</span>
            </label>
          )
        )}
      </div>
      <SectionTitle>Required Documents</SectionTitle>
      <div className="space-y-2">
        {["Commercial Invoice", "Packing List", "Certificate of Origin (if required)"].map((doc) => (
          <div
            key={doc}
            className="flex items-center justify-between px-4 py-3 border border-[#E2E8F0] rounded-xl bg-[#F8FAFC]"
          >
            <span className="text-sm text-[#334155]">{doc}</span>
            <span className="text-xs text-[#FFB800] font-semibold bg-[#FFF8E6] px-2 py-0.5 rounded-full">
              Auto-generated
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Step 5: Pricing Review ───────────────────────────────────────────────────
const RATE_OPTIONS = [
  { id: "express", label: "Express International", eta: "2–3 business days", price: "$89.00",  icon: Plane,  best: true },
  { id: "standard", label: "Standard International", eta: "5–7 business days", price: "$42.00", icon: Package, best: false },
  { id: "economy",  label: "Economy Freight",       eta: "10–14 business days", price: "$22.00", icon: Package, best: false },
];

function StepPricing() {
  const [selected, setSelected] = useState("express");
  return (
    <div className="space-y-4">
      <SectionTitle>Choose your service</SectionTitle>
      <div className="space-y-3">
        {RATE_OPTIONS.map((opt) => {
          const Icon = opt.icon;
          const active = selected === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => setSelected(opt.id)}
              className={`
                w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all
                ${active
                  ? "border-[#FFB800] bg-[#FFF8E6]"
                  : "border-[#E2E8F0] bg-white hover:bg-[#F8FAFC]"
                }
              `}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${active ? "bg-[#FFB800]/20" : "bg-[#F1F5F9]"}`}>
                <Icon size={18} className={active ? "text-[#92670A]" : "text-[#64748B]"} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-[#0F172A]">{opt.label}</p>
                  {opt.best && (
                    <span className="text-[10px] bg-[#FFB800] text-[#0F172A] px-2 py-0.5 rounded-full font-bold">
                      Recommended
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#64748B] mt-0.5">{opt.eta}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-base font-extrabold text-[#0F172A]">{opt.price}</p>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${active ? "border-[#FFB800] bg-[#FFB800]" : "border-[#CBD5E1]"}`}>
                {active && <Check size={11} className="text-[#0F172A]" />}
              </div>
            </button>
          );
        })}
      </div>

      <SectionTitle>Add-ons</SectionTitle>
      {[
        { label: "Shipment Insurance", sub: "Up to $1,000 coverage", price: "+$8.00" },
        { label: "Signature on Delivery", sub: "Recipient must sign", price: "+$3.50" },
        { label: "SMS Tracking Alerts", sub: "Real-time updates", price: "Free" },
      ].map((addon) => (
        <label
          key={addon.label}
          className="flex items-center justify-between px-4 py-3.5 border border-[#E2E8F0] rounded-xl cursor-pointer hover:bg-[#F8FAFC] transition-colors"
        >
          <div className="flex items-center gap-3">
            <input type="checkbox" className="w-4 h-4 accent-[#FFB800] rounded" />
            <div>
              <p className="text-sm font-semibold text-[#334155]">{addon.label}</p>
              <p className="text-xs text-[#94A3B8]">{addon.sub}</p>
            </div>
          </div>
          <span className="text-sm font-bold text-[#0F172A]">{addon.price}</span>
        </label>
      ))}

      {/* Price summary */}
      <div className="bg-[#0F172A] rounded-2xl p-5 space-y-3 mt-2">
        {[
          { label: "Express International", amount: "$89.00" },
          { label: "Insurance",             amount: "$8.00" },
          { label: "Fuel Surcharge",         amount: "$4.20" },
          { label: "Estimated Duties (US)",  amount: "$12.60" },
        ].map((row) => (
          <div key={row.label} className="flex justify-between text-sm text-[#64748B]">
            <span>{row.label}</span>
            <span className="font-medium">{row.amount}</span>
          </div>
        ))}
        <div className="border-t border-[#1E293B] pt-3 flex justify-between">
          <span className="text-white font-bold">Total Estimate</span>
          <span className="text-[#FFB800] font-extrabold text-lg">$113.80</span>
        </div>
      </div>
    </div>
  );
}

// ─── Step 6: Payment ──────────────────────────────────────────────────────────
function StepPayment() {
  return (
    <div className="space-y-4">
      <SectionTitle>Payment Method</SectionTitle>
      <div className="grid grid-cols-3 gap-3">
        {["Credit Card", "Bank Transfer", "Wallet Balance"].map((method, i) => (
          <button
            key={method}
            className={`py-3 px-2 rounded-xl border-2 text-xs font-semibold transition-all text-center ${
              i === 0 ? "border-[#FFB800] bg-[#FFF8E6] text-[#92670A]" : "border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC]"
            }`}
          >
            {method}
          </button>
        ))}
      </div>

      <SectionTitle>Card Details</SectionTitle>
      <div>
        <Label required>Card Number</Label>
        <Input placeholder="4242 4242 4242 4242" />
      </div>
      <FieldGroup>
        <div>
          <Label required>Expiry Date</Label>
          <Input placeholder="MM / YY" />
        </div>
        <div>
          <Label required>CVV</Label>
          <Input placeholder="•••" type="password" />
        </div>
      </FieldGroup>
      <div>
        <Label required>Cardholder Name</Label>
        <Input placeholder="Jane Doe" />
      </div>

      <div className="p-3 bg-green-50 border border-green-100 rounded-xl flex gap-2 mt-2">
        <Shield size={13} className="text-green-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-green-700">
          Payments are processed securely via Stripe. Your card details are never stored on Yellowduck servers.
        </p>
      </div>
    </div>
  );
}

// ─── Step 7: Confirmation ─────────────────────────────────────────────────────
function StepConfirm() {
  return (
    <div className="space-y-5">
      <div className="flex flex-col items-center text-center py-6">
        <div className="w-16 h-16 rounded-full bg-green-50 border-4 border-green-100 flex items-center justify-center mb-4">
          <CheckCircle2 size={32} className="text-green-500" />
        </div>
        <h3 className="text-xl font-extrabold text-[#0F172A]">Shipment Booked!</h3>
        <p className="text-sm text-[#64748B] mt-2 max-w-xs leading-relaxed">
          Your shipment has been created. A courier will pick up within 2 hours.
        </p>
        <div className="mt-3 px-5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-full">
          <span className="text-base font-extrabold text-[#0F172A] tracking-tight">YDK-INTL-000183</span>
        </div>
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-2xl divide-y divide-[#F8FAFC]">
        {[
          { label: "Route",    value: "Lagos, Nigeria → New York, US" },
          { label: "Service",  value: "Express International" },
          { label: "ETA",      value: "Jun 2, 2026" },
          { label: "Total",    value: "$113.80 charged" },
        ].map((row) => (
          <div key={row.label} className="flex justify-between px-5 py-3.5 text-sm">
            <span className="text-[#64748B]">{row.label}</span>
            <span className="font-semibold text-[#0F172A]">{row.value}</span>
          </div>
        ))}
      </div>

      <p className="text-xs text-center text-[#94A3B8]">
        Confirmation sent to <strong className="text-[#64748B]">jane@acmecorp.com</strong>
      </p>
    </div>
  );
}

const STEP_COMPONENTS = [
  StepSender,
  StepRecipient,
  StepPackage,
  StepCustoms,
  StepPricing,
  StepPayment,
  StepConfirm,
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function CreateShipmentPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const StepComponent = STEP_COMPONENTS[currentStep - 1];
  const isLast = currentStep === STEPS.length;
  const isDone = false; // after submission would be true

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar title="Create Shipment" subtitle="New international shipment" />

        <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
          <div className="max-w-2xl mx-auto">

            {/* ── Step Indicator ───────────────────────────────── */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 mb-6 shadow-sm overflow-x-auto">
              <div className="flex items-center min-w-[520px]">
                {STEPS.map((step, i) => {
                  const Icon = step.icon;
                  const done   = currentStep > step.id;
                  const active = currentStep === step.id;
                  return (
                    <div key={step.id} className="flex-1 flex flex-col items-center relative">
                      {/* connector */}
                      {i > 0 && (
                        <div className={`absolute left-0 right-1/2 top-4 h-0.5 ${done ? "bg-[#FFB800]" : "bg-[#E2E8F0]"}`} />
                      )}
                      {i < STEPS.length - 1 && (
                        <div className={`absolute left-1/2 right-0 top-4 h-0.5 ${done && !active ? "bg-[#FFB800]" : "bg-[#E2E8F0]"}`} />
                      )}
                      <button
                        onClick={() => done && setCurrentStep(step.id)}
                        disabled={!done}
                        className={`
                          relative z-10 w-8 h-8 rounded-full flex items-center justify-center
                          border-2 transition-all text-xs
                          ${done   ? "bg-[#FFB800] border-[#FFB800] cursor-pointer" : ""}
                          ${active ? "bg-[#0F172A] border-[#0F172A] ring-4 ring-[#FFB800]/20" : ""}
                          ${!done && !active ? "bg-white border-[#E2E8F0]" : ""}
                        `}
                      >
                        {done
                          ? <Check size={13} className="text-[#0F172A]" />
                          : <Icon size={13} className={active ? "text-white" : "text-[#CBD5E1]"} />
                        }
                      </button>
                      <span className={`text-[10px] mt-1.5 font-semibold text-center ${active ? "text-[#0F172A]" : done ? "text-[#64748B]" : "text-[#CBD5E1]"}`}>
                        {step.shortLabel}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Step Content ─────────────────────────────────── */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm">
              <div className="px-6 sm:px-8 py-5 border-b border-[#F1F5F9]">
                <h2 className="text-base font-extrabold text-[#0F172A]">
                  Step {currentStep} — {STEPS[currentStep - 1].label}
                </h2>
                <p className="text-xs text-[#94A3B8] mt-0.5">
                  {currentStep} of {STEPS.length}
                </p>
              </div>

              <div className="px-6 sm:px-8 py-6">
                <StepComponent />
              </div>

              {/* Navigation */}
              {currentStep < STEPS.length && (
                <div className="px-6 sm:px-8 py-5 border-t border-[#F1F5F9] flex items-center justify-between gap-4">
                  <button
                    onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
                    disabled={currentStep === 1}
                    className="
                      flex items-center gap-2 px-5 py-2.5 rounded-xl
                      border border-[#E2E8F0] text-sm font-semibold text-[#64748B]
                      hover:bg-[#F8FAFC] disabled:opacity-40 disabled:cursor-not-allowed transition-all
                    "
                  >
                    <ChevronLeft size={15} />
                    Back
                  </button>

                  <div className="flex items-center gap-1">
                    {STEPS.map((s) => (
                      <div
                        key={s.id}
                        className={`h-1.5 rounded-full transition-all ${
                          s.id === currentStep ? "w-6 bg-[#FFB800]" : s.id < currentStep ? "w-2 bg-[#FFB800]/40" : "w-2 bg-[#E2E8F0]"
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => setCurrentStep((s) => Math.min(STEPS.length, s + 1))}
                    className="
                      flex items-center gap-2 px-5 py-2.5 rounded-xl
                      bg-[#FFB800] text-[#0F172A] text-sm font-bold
                      hover:bg-[#F0AE00] active:scale-[0.98] transition-all shadow-sm
                    "
                  >
                    {currentStep === STEPS.length - 1 ? "Review & Pay" : "Continue"}
                    <ChevronRight size={15} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}