"use client";

/**
 * app/dashboard/create/page.js
 * ─────────────────────────────────────────────────────────
 * Create Shipment Wizard — 7-step logistics intake form.
 *
 * Architecture:
 *   • Single formData object holds all fields across all steps
 *   • handleChange() is a universal field updater (scalable to 100+ fields)
 *   • Step components are pure UI — they receive { formData, handleChange }
 *   • handleSubmit() orchestrates the entire creation pipeline:
 *       1. Calculate volumetric weight
 *       2. Calculate chargeable weight
 *       3. Estimate rate
 *       4. Generate tracking number
 *       5. createShipment() → persists to DB
 *       6. createShipmentEvent() → writes LABEL_CREATED audit event
 *       7. Advance to confirmation step
 *
 * Imports are all relative — no Firebase needed to run this file.
 */

import { useState, useCallback } from "react";
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
  AlertTriangle,
  Loader2,
  Weight,
  Box,
  Copy,
} from "lucide-react";

// ─── Service & Logic Imports ──────────────────────────────────────────────────
import { generateTrackingNumber }      from "@/lib/utils/generateTrackingNumber";
import { calculateVolumetricWeight }   from "@/lib/logistics/pricing/calculateVolumetricWeight";
import { calculateChargeableWeight }   from "@/lib/logistics/pricing/calculateChargeableWeight";
import { estimateRate }                from "@/lib/logistics/pricing/estimateRate";
import { auth }                        from "@/lib/firebase/client";
import { createShipment, createShipmentEvent } from "@/services/shipment.service";

// ─── Wizard Step Definitions ──────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: "Sender",    icon: User,         shortLabel: "Sender" },
  { id: 2, label: "Recipient", icon: MapPin,        shortLabel: "Recipient" },
  { id: 3, label: "Package",   icon: Package,       shortLabel: "Package" },
  { id: 4, label: "Customs",   icon: Shield,        shortLabel: "Customs" },
  { id: 5, label: "Pricing",   icon: DollarSign,    shortLabel: "Pricing" },
  { id: 6, label: "Payment",   icon: CreditCard,    shortLabel: "Payment" },
  { id: 7, label: "Confirm",   icon: CheckCircle2,  shortLabel: "Confirm" },
];

// ─── Initial Form State ────────────────────────────────────────────────────────
// All fields live in one flat object. Nested data is assembled in handleSubmit.
const INITIAL_FORM_DATA = {
  // Step 1 — Sender
  senderFirstName:    "",
  senderLastName:     "",
  senderCompany:      "",
  senderEmail:        "",
  senderPhone:        "",
  senderAddress1:     "",
  senderCity:         "",
  senderState:        "",
  senderPostal:       "",
  senderCountry:      "",

  // Step 2 — Recipient
  recipientFirstName: "",
  recipientLastName:  "",
  recipientCompany:   "",
  recipientEmail:     "",
  recipientPhone:     "",
  recipientAddress1:  "",
  recipientAddress2:  "",
  recipientCity:      "",
  recipientState:     "",
  recipientPostal:    "",
  recipientCountry:   "",

  // Step 3 — Package
  weightKg:    "",
  lengthCm:    "",
  widthCm:     "",
  heightCm:    "",
  packageType: "PARCEL",
  contents:    "",
  fragile:     false,
  keepUpright: false,

  // Step 4 — Customs
  declaredValueUSD: "",
  hsCode:           "",
  originCountry:    "",
  shipmentPurpose:  "COMMERCIAL_SALE",

  // Step 5 — Service selection
  serviceCode:   "EXPRESS",
  addInsurance:  false,
  addSignature:  false,

  // Step 6 — Payment (never sent to DB in real life — handled by payment processor)
  cardNumber:    "",
  cardExpiry:    "",
  cardCvv:       "",
  cardName:      "",
};

// ─── Shared UI Primitives ──────────────────────────────────────────────────────
function FieldLabel({ children, required }) {
  return (
    <label className="block text-xs font-semibold text-[#334155] mb-1.5">
      {children}
      {required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
  );
}

function TextInput({ name, placeholder, type = "text", value, onChange, ...rest }) {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="
        w-full px-4 py-3 rounded-xl border border-[#E2E8F0]
        text-sm text-[#0F172A] placeholder:text-[#CBD5E1]
        bg-[#F8FAFC] focus:bg-white focus:outline-none
        focus:border-[#FFB800] focus:ring-2 focus:ring-[#FFB800]/20
        transition-all
      "
      {...rest}
    />
  );
}

function SelectInput({ name, value, onChange, children }) {
  return (
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="
        w-full px-4 py-3 rounded-xl border border-[#E2E8F0]
        text-sm text-[#0F172A] bg-[#F8FAFC]
        focus:bg-white focus:outline-none focus:border-[#FFB800] focus:ring-2 focus:ring-[#FFB800]/20
        transition-all appearance-none
      "
    >
      {children}
    </select>
  );
}

function FieldRow({ children }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>;
}

function SectionHeading({ children }) {
  return (
    <h3 className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-4 mt-6 first:mt-0">
      {children}
    </h3>
  );
}

function InfoBanner({ icon: Icon, color = "blue", children }) {
  const colors = {
    blue:   "bg-blue-50 border-blue-100 text-blue-700",
    amber:  "bg-amber-50 border-amber-200 text-amber-700",
    green:  "bg-green-50 border-green-100 text-green-700",
    red:    "bg-red-50 border-red-100 text-red-700",
  };
  return (
    <div className={`flex gap-2.5 p-3.5 rounded-xl border ${colors[color]}`}>
      {Icon && <Icon size={14} className="flex-shrink-0 mt-0.5" />}
      <p className="text-xs leading-relaxed">{children}</p>
    </div>
  );
}

// ─── STEP 1: Sender Info ───────────────────────────────────────────────────────
function StepSender({ formData, onChange }) {
  return (
    <div className="space-y-4">
      <SectionHeading>Sender Contact</SectionHeading>
      <FieldRow>
        <div>
          <FieldLabel required>First Name</FieldLabel>
          <TextInput name="senderFirstName" placeholder="Jane" value={formData.senderFirstName} onChange={onChange} />
        </div>
        <div>
          <FieldLabel required>Last Name</FieldLabel>
          <TextInput name="senderLastName" placeholder="Doe" value={formData.senderLastName} onChange={onChange} />
        </div>
      </FieldRow>
      <div>
        <FieldLabel>Company (optional)</FieldLabel>
        <TextInput name="senderCompany" placeholder="Acme Corp" value={formData.senderCompany} onChange={onChange} />
      </div>
      <FieldRow>
        <div>
          <FieldLabel required>Email</FieldLabel>
          <TextInput name="senderEmail" type="email" placeholder="jane@example.com" value={formData.senderEmail} onChange={onChange} />
        </div>
        <div>
          <FieldLabel required>Phone</FieldLabel>
          <TextInput name="senderPhone" type="tel" placeholder="+234 800 000 0000" value={formData.senderPhone} onChange={onChange} />
        </div>
      </FieldRow>

      <SectionHeading>Pickup Address</SectionHeading>
      <div>
        <FieldLabel required>Street Address</FieldLabel>
        <TextInput name="senderAddress1" placeholder="15 Victoria Island Blvd" value={formData.senderAddress1} onChange={onChange} />
      </div>
      <FieldRow>
        <div>
          <FieldLabel required>City</FieldLabel>
          <TextInput name="senderCity" placeholder="Lagos" value={formData.senderCity} onChange={onChange} />
        </div>
        <div>
          <FieldLabel required>State / Province</FieldLabel>
          <TextInput name="senderState" placeholder="Lagos State" value={formData.senderState} onChange={onChange} />
        </div>
      </FieldRow>
      <FieldRow>
        <div>
          <FieldLabel required>Postal Code</FieldLabel>
          <TextInput name="senderPostal" placeholder="101001" value={formData.senderPostal} onChange={onChange} />
        </div>
        <div>
          <FieldLabel required>Country</FieldLabel>
          <SelectInput name="senderCountry" value={formData.senderCountry} onChange={onChange}>
            <option value="">Select country…</option>
            <option value="NG">Nigeria</option>
            <option value="GB">United Kingdom</option>
            <option value="US">United States</option>
            <option value="AE">United Arab Emirates</option>
            <option value="DE">Germany</option>
            <option value="SG">Singapore</option>
            <option value="CA">Canada</option>
          </SelectInput>
        </div>
      </FieldRow>
    </div>
  );
}

// ─── STEP 2: Recipient Info ────────────────────────────────────────────────────
function StepRecipient({ formData, onChange }) {
  return (
    <div className="space-y-4">
      <SectionHeading>Recipient Contact</SectionHeading>
      <FieldRow>
        <div>
          <FieldLabel required>First Name</FieldLabel>
          <TextInput name="recipientFirstName" placeholder="Marcus" value={formData.recipientFirstName} onChange={onChange} />
        </div>
        <div>
          <FieldLabel required>Last Name</FieldLabel>
          <TextInput name="recipientLastName" placeholder="Webb" value={formData.recipientLastName} onChange={onChange} />
        </div>
      </FieldRow>
      <div>
        <FieldLabel>Company (optional)</FieldLabel>
        <TextInput name="recipientCompany" placeholder="Webb Ventures LLC" value={formData.recipientCompany} onChange={onChange} />
      </div>
      <FieldRow>
        <div>
          <FieldLabel required>Email</FieldLabel>
          <TextInput name="recipientEmail" type="email" placeholder="marcus@example.com" value={formData.recipientEmail} onChange={onChange} />
        </div>
        <div>
          <FieldLabel required>Phone</FieldLabel>
          <TextInput name="recipientPhone" type="tel" placeholder="+1 212 555 0192" value={formData.recipientPhone} onChange={onChange} />
        </div>
      </FieldRow>

      <SectionHeading>Delivery Address</SectionHeading>
      <div>
        <FieldLabel required>Street Address</FieldLabel>
        <TextInput name="recipientAddress1" placeholder="350 5th Avenue" value={formData.recipientAddress1} onChange={onChange} />
      </div>
      <div>
        <FieldLabel>Address Line 2</FieldLabel>
        <TextInput name="recipientAddress2" placeholder="Suite 1200" value={formData.recipientAddress2} onChange={onChange} />
      </div>
      <FieldRow>
        <div>
          <FieldLabel required>City</FieldLabel>
          <TextInput name="recipientCity" placeholder="New York" value={formData.recipientCity} onChange={onChange} />
        </div>
        <div>
          <FieldLabel required>State / Province</FieldLabel>
          <TextInput name="recipientState" placeholder="NY" value={formData.recipientState} onChange={onChange} />
        </div>
      </FieldRow>
      <FieldRow>
        <div>
          <FieldLabel required>Postal / ZIP Code</FieldLabel>
          <TextInput name="recipientPostal" placeholder="10118" value={formData.recipientPostal} onChange={onChange} />
        </div>
        <div>
          <FieldLabel required>Country</FieldLabel>
          <SelectInput name="recipientCountry" value={formData.recipientCountry} onChange={onChange}>
            <option value="">Select country…</option>
            <option value="US">United States</option>
            <option value="GB">United Kingdom</option>
            <option value="NG">Nigeria</option>
            <option value="AE">United Arab Emirates</option>
            <option value="DE">Germany</option>
            <option value="SG">Singapore</option>
            <option value="CA">Canada</option>
          </SelectInput>
        </div>
      </FieldRow>
      <InfoBanner icon={AlertCircle} color="blue">
        We'll send the recipient an SMS + email with live tracking as soon as the shipment is booked.
      </InfoBanner>
    </div>
  );
}

// ─── STEP 3: Package Details ───────────────────────────────────────────────────
function StepPackage({ formData, onChange }) {
  // Compute live volumetric weight preview
  const l = parseFloat(formData.lengthCm) || 0;
  const w = parseFloat(formData.widthCm)  || 0;
  const h = parseFloat(formData.heightCm) || 0;
  const a = parseFloat(formData.weightKg) || 0;
  const vol = calculateVolumetricWeight({ lengthCm: l, widthCm: w, heightCm: h });
  const { chargeableWeight, basis } = calculateChargeableWeight({ actualWeight: a, volumetricWeight: vol });
  const hasCalc = l > 0 && w > 0 && h > 0 && a > 0;

  return (
    <div className="space-y-4">
      <SectionHeading>Weight & Dimensions</SectionHeading>
      <FieldRow>
        <div>
          <FieldLabel required>Actual Weight (kg)</FieldLabel>
          <TextInput name="weightKg" type="number" placeholder="3.4" min="0.01" step="0.01" value={formData.weightKg} onChange={onChange} />
        </div>
        <div>
          <FieldLabel>Package Type</FieldLabel>
          <SelectInput name="packageType" value={formData.packageType} onChange={onChange}>
            <option value="PARCEL">Parcel / Box</option>
            <option value="DOCUMENT">Document Envelope</option>
            <option value="PALLET">Pallet</option>
            <option value="TUBE">Tube</option>
            <option value="FRAGILE">Fragile / Crated</option>
          </SelectInput>
        </div>
      </FieldRow>

      <div>
        <FieldLabel required>Dimensions (cm)</FieldLabel>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <TextInput name="lengthCm" type="number" placeholder="Length" min="1" step="0.5" value={formData.lengthCm} onChange={onChange} />
            <p className="text-[10px] text-[#94A3B8] mt-1 text-center">Length</p>
          </div>
          <div>
            <TextInput name="widthCm" type="number" placeholder="Width" min="1" step="0.5" value={formData.widthCm} onChange={onChange} />
            <p className="text-[10px] text-[#94A3B8] mt-1 text-center">Width</p>
          </div>
          <div>
            <TextInput name="heightCm" type="number" placeholder="Height" min="1" step="0.5" value={formData.heightCm} onChange={onChange} />
            <p className="text-[10px] text-[#94A3B8] mt-1 text-center">Height</p>
          </div>
        </div>
      </div>

      {/* Live weight calculator */}
      {hasCalc ? (
        <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 space-y-2">
          <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-3">Weight Summary</p>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-white rounded-lg border border-[#E2E8F0] px-3 py-2.5">
              <p className="text-[10px] text-[#94A3B8]">Actual</p>
              <p className="text-base font-extrabold text-[#0F172A]">{a} kg</p>
            </div>
            <div className="bg-white rounded-lg border border-[#E2E8F0] px-3 py-2.5">
              <p className="text-[10px] text-[#94A3B8]">Volumetric</p>
              <p className="text-base font-extrabold text-[#0F172A]">{vol} kg</p>
            </div>
            <div className="bg-[#FFB800]/10 border border-[#FFB800]/30 rounded-lg px-3 py-2.5">
              <p className="text-[10px] text-[#92670A] font-semibold">Chargeable</p>
              <p className="text-base font-extrabold text-[#0F172A]">{chargeableWeight} kg</p>
            </div>
          </div>
          {basis === "volumetric" && (
            <p className="text-[11px] text-amber-600 flex items-center gap-1 mt-1">
              <AlertCircle size={11} />
              Volumetric weight applies — your package is large relative to its weight.
            </p>
          )}
        </div>
      ) : (
        <div className="bg-[#F8FAFC] border border-dashed border-[#E2E8F0] rounded-xl p-4 text-center">
          <p className="text-xs text-[#94A3B8]">Enter weight and dimensions to see chargeable weight preview</p>
        </div>
      )}

      <SectionHeading>Contents</SectionHeading>
      <div>
        <FieldLabel required>Contents Description</FieldLabel>
        <textarea
          name="contents"
          rows={3}
          placeholder="e.g. Electronic accessories, laptop cables — be specific for customs clearance"
          value={formData.contents}
          onChange={onChange}
          className="
            w-full px-4 py-3 rounded-xl border border-[#E2E8F0]
            text-sm text-[#0F172A] placeholder:text-[#CBD5E1] bg-[#F8FAFC]
            focus:bg-white focus:outline-none focus:border-[#FFB800] focus:ring-2 focus:ring-[#FFB800]/20
            transition-all resize-none
          "
        />
      </div>

      <SectionHeading>Special Handling</SectionHeading>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          { name: "fragile",     label: "Fragile" },
          { name: "keepUpright", label: "Keep Upright" },
        ].map((opt) => (
          <label
            key={opt.name}
            className="flex items-center gap-3 px-4 py-3 border border-[#E2E8F0] rounded-xl cursor-pointer hover:bg-[#F8FAFC] transition-colors"
          >
            <input
              type="checkbox"
              name={opt.name}
              checked={formData[opt.name]}
              onChange={onChange}
              className="rounded w-4 h-4 accent-[#FFB800]"
            />
            <span className="text-sm text-[#334155] font-medium">{opt.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

// ─── STEP 4: Customs Info ──────────────────────────────────────────────────────
function StepCustoms({ formData, onChange }) {
  return (
    <div className="space-y-4">
      <InfoBanner icon={Shield} color="amber">
        All international shipments require an accurate customs declaration. Inaccurate information may cause delays, fines, or seizure of goods.
      </InfoBanner>

      <SectionHeading>Declared Value & Classification</SectionHeading>
      <FieldRow>
        <div>
          <FieldLabel required>Declared Value (USD)</FieldLabel>
          <TextInput name="declaredValueUSD" type="number" placeholder="420.00" min="0" step="0.01" value={formData.declaredValueUSD} onChange={onChange} />
        </div>
        <div>
          <FieldLabel>HS / HTS Code</FieldLabel>
          <TextInput name="hsCode" placeholder="8471.30" value={formData.hsCode} onChange={onChange} />
        </div>
      </FieldRow>
      <div>
        <FieldLabel required>Country of Origin</FieldLabel>
        <SelectInput name="originCountry" value={formData.originCountry} onChange={onChange}>
          <option value="">Select country…</option>
          <option value="NG">Nigeria</option>
          <option value="CN">China</option>
          <option value="US">United States</option>
          <option value="GB">United Kingdom</option>
          <option value="DE">Germany</option>
          <option value="IN">India</option>
        </SelectInput>
      </div>

      <SectionHeading>Shipment Purpose</SectionHeading>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          { value: "COMMERCIAL_SALE", label: "Commercial Sale" },
          { value: "GIFT",            label: "Gift" },
          { value: "PERSONAL_USE",    label: "Personal Use / Return" },
          { value: "REPAIR",          label: "Repair / Warranty" },
          { value: "SAMPLE",          label: "Sample — No Commercial Value" },
        ].map((opt) => (
          <label
            key={opt.value}
            className={`
              flex items-center gap-3 px-4 py-3 border rounded-xl cursor-pointer transition-colors
              ${formData.shipmentPurpose === opt.value
                ? "border-[#FFB800] bg-[#FFF8E6]"
                : "border-[#E2E8F0] hover:bg-[#F8FAFC]"
              }
            `}
          >
            <input
              type="radio"
              name="shipmentPurpose"
              value={opt.value}
              checked={formData.shipmentPurpose === opt.value}
              onChange={onChange}
              className="w-4 h-4 accent-[#FFB800]"
            />
            <span className="text-sm text-[#334155] font-medium">{opt.label}</span>
          </label>
        ))}
      </div>

      <SectionHeading>Required Documents</SectionHeading>
      {["Commercial Invoice", "Packing List", "Certificate of Origin (if applicable)"].map((doc) => (
        <div key={doc} className="flex items-center justify-between px-4 py-3 border border-[#E2E8F0] rounded-xl bg-[#F8FAFC]">
          <span className="text-sm text-[#334155]">{doc}</span>
          <span className="text-[10px] font-bold text-[#FFB800] bg-[#FFF8E6] border border-[#FFB800]/20 px-2 py-0.5 rounded-full">
            Auto-generated
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── STEP 5: Pricing Review ────────────────────────────────────────────────────
function StepPricing({ formData, onChange }) {
  // Compute everything live from current formData
  const l   = parseFloat(formData.lengthCm)       || 0;
  const w   = parseFloat(formData.widthCm)         || 0;
  const h   = parseFloat(formData.heightCm)        || 0;
  const a   = parseFloat(formData.weightKg)        || 0;
  const dv  = parseFloat(formData.declaredValueUSD) || 0;

  const vol = calculateVolumetricWeight({ lengthCm: l, widthCm: w, heightCm: h });
  const { chargeableWeight } = calculateChargeableWeight({ actualWeight: a, volumetricWeight: vol });

  const rate = estimateRate({
    chargeableWeight,
    serviceCode: formData.serviceCode,
    declaredValueUSD: dv,
    destinationCountryCode: formData.recipientCountry,
  });

  const addons = [
    { name: "addInsurance", label: "Shipment Insurance",   sub: "Up to $1,000 coverage",  amount: 8.00 },
    { name: "addSignature", label: "Signature on Delivery", sub: "Recipient must sign",    amount: 3.50 },
  ];

  const addonsTotal = addons.reduce((sum, a) => formData[a.name] ? sum + a.amount : sum, 0);
  const grandTotal  = Math.round((rate.totalUSD + addonsTotal) * 100) / 100;

  const SERVICES = [
    { code: "EXPRESS",  label: "Express International", eta: "2–3 business days", icon: Plane },
    { code: "STANDARD", label: "Standard International", eta: "5–7 business days", icon: Package },
    { code: "ECONOMY",  label: "Economy Freight",        eta: "10–14 business days", icon: Package },
  ];

  return (
    <div className="space-y-4">
      <SectionHeading>Choose Service Tier</SectionHeading>
      <div className="space-y-3">
        {SERVICES.map((svc) => {
          const Icon = svc.icon;
          const active = formData.serviceCode === svc.code;
          const preview = estimateRate({ chargeableWeight, serviceCode: svc.code, declaredValueUSD: dv, destinationCountryCode: formData.recipientCountry });
          return (
            <button
              key={svc.code}
              type="button"
              onClick={() => onChange({ target: { name: "serviceCode", value: svc.code } })}
              className={`
                w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all
                ${active ? "border-[#FFB800] bg-[#FFF8E6]" : "border-[#E2E8F0] bg-white hover:bg-[#F8FAFC]"}
              `}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${active ? "bg-[#FFB800]/20" : "bg-[#F1F5F9]"}`}>
                <Icon size={17} className={active ? "text-[#92670A]" : "text-[#64748B]"} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-[#0F172A]">{svc.label}</p>
                  {svc.code === "EXPRESS" && (
                    <span className="text-[10px] bg-[#FFB800] text-[#0F172A] px-1.5 py-0.5 rounded-full font-bold">Best</span>
                  )}
                </div>
                <p className="text-xs text-[#64748B] mt-0.5">{svc.eta}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-base font-extrabold text-[#0F172A]">${preview.totalUSD.toFixed(2)}</p>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${active ? "border-[#FFB800] bg-[#FFB800]" : "border-[#CBD5E1]"}`}>
                {active && <Check size={11} className="text-[#0F172A]" />}
              </div>
            </button>
          );
        })}
      </div>

      <SectionHeading>Add-ons</SectionHeading>
      <div className="space-y-2">
        {addons.map((addon) => (
          <label
            key={addon.name}
            className="flex items-center justify-between px-4 py-3.5 border border-[#E2E8F0] rounded-xl cursor-pointer hover:bg-[#F8FAFC] transition-colors"
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                name={addon.name}
                checked={formData[addon.name]}
                onChange={onChange}
                className="w-4 h-4 accent-[#FFB800] rounded"
              />
              <div>
                <p className="text-sm font-semibold text-[#334155]">{addon.label}</p>
                <p className="text-xs text-[#94A3B8]">{addon.sub}</p>
              </div>
            </div>
            <span className="text-sm font-bold text-[#0F172A]">+${addon.amount.toFixed(2)}</span>
          </label>
        ))}
      </div>

      {/* Price summary card */}
      <div className="bg-[#0F172A] rounded-2xl p-5 space-y-3 mt-2">
        {rate.breakdown.map((row) => (
          <div key={row.label} className="flex justify-between text-sm text-[#64748B]">
            <span>{row.label}</span>
            <span className="font-medium">${row.amount.toFixed(2)}</span>
          </div>
        ))}
        {addons.filter((a) => formData[a.name]).map((addon) => (
          <div key={addon.name} className="flex justify-between text-sm text-[#64748B]">
            <span>{addon.label}</span>
            <span className="font-medium">+${addon.amount.toFixed(2)}</span>
          </div>
        ))}
        <div className="border-t border-[#1E293B] pt-3 flex justify-between items-baseline">
          <span className="text-white font-bold text-sm">Total Estimate</span>
          <span className="text-[#FFB800] font-extrabold text-xl">${grandTotal.toFixed(2)}</span>
        </div>
        <p className="text-[10px] text-[#475569] leading-snug">
          Final price confirmed at booking. Duties are estimates based on declared value and may vary at customs.
        </p>
      </div>
    </div>
  );
}

// ─── STEP 6: Payment ───────────────────────────────────────────────────────────
function StepPayment({ formData, onChange }) {
  const [method, setMethod] = useState("CARD");

  return (
    <div className="space-y-4">
      <SectionHeading>Payment Method</SectionHeading>
      <div className="grid grid-cols-3 gap-3">
        {[
          { id: "CARD",     label: "Credit Card" },
          { id: "BANK",     label: "Bank Transfer" },
          { id: "WALLET",   label: "Wallet Balance" },
        ].map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setMethod(m.id)}
            className={`
              py-3 px-2 rounded-xl border-2 text-xs font-semibold transition-all
              ${method === m.id ? "border-[#FFB800] bg-[#FFF8E6] text-[#92670A]" : "border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC]"}
            `}
          >
            {m.label}
          </button>
        ))}
      </div>

      {method === "CARD" && (
        <>
          <SectionHeading>Card Details</SectionHeading>
          <div>
            <FieldLabel required>Card Number</FieldLabel>
            <TextInput name="cardNumber" placeholder="4242 4242 4242 4242" value={formData.cardNumber} onChange={onChange} />
          </div>
          <FieldRow>
            <div>
              <FieldLabel required>Expiry</FieldLabel>
              <TextInput name="cardExpiry" placeholder="MM / YY" value={formData.cardExpiry} onChange={onChange} />
            </div>
            <div>
              <FieldLabel required>CVV</FieldLabel>
              <TextInput name="cardCvv" type="password" placeholder="•••" value={formData.cardCvv} onChange={onChange} />
            </div>
          </FieldRow>
          <div>
            <FieldLabel required>Cardholder Name</FieldLabel>
            <TextInput name="cardName" placeholder="Jane Doe" value={formData.cardName} onChange={onChange} />
          </div>
        </>
      )}

      {method === "BANK" && (
        <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-5 space-y-3">
          <p className="text-sm font-bold text-[#0F172A]">Bank Transfer Details</p>
          {[
            { label: "Account Name",   value: "Yellowduck Logistics Inc." },
            { label: "Account Number", value: "0123456789" },
            { label: "Sort Code",      value: "20-00-00" },
            { label: "Reference",      value: "YDK-PAY-PENDING" },
          ].map((row) => (
            <div key={row.label} className="flex justify-between text-sm">
              <span className="text-[#94A3B8]">{row.label}</span>
              <span className="font-semibold text-[#0F172A]">{row.value}</span>
            </div>
          ))}
        </div>
      )}

      {method === "WALLET" && (
        <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-5 text-center">
          <p className="text-2xl font-extrabold text-[#0F172A]">$1,240.00</p>
          <p className="text-xs text-[#64748B] mt-1">Available wallet balance</p>
        </div>
      )}

      <InfoBanner icon={Shield} color="green">
        Payments are processed securely via Stripe. Your card details are never stored on Yellowduck servers.
      </InfoBanner>
    </div>
  );
}

// ─── STEP 7: Confirmation ──────────────────────────────────────────────────────
function StepConfirm({ trackingNumber, formData }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(trackingNumber);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const l  = parseFloat(formData.lengthCm)        || 0;
  const w  = parseFloat(formData.widthCm)          || 0;
  const h  = parseFloat(formData.heightCm)         || 0;
  const a  = parseFloat(formData.weightKg)         || 0;
  const dv = parseFloat(formData.declaredValueUSD)  || 0;
  const vol = calculateVolumetricWeight({ lengthCm: l, widthCm: w, heightCm: h });
  const { chargeableWeight } = calculateChargeableWeight({ actualWeight: a, volumetricWeight: vol });
  const rate = estimateRate({
    chargeableWeight,
    serviceCode: formData.serviceCode,
    declaredValueUSD: dv,
    destinationCountryCode: formData.recipientCountry,
  });
  const addonsTotal = (formData.addInsurance ? 8 : 0) + (formData.addSignature ? 3.50 : 0);
  const grandTotal  = Math.round((rate.totalUSD + addonsTotal) * 100) / 100;

  return (
    <div className="space-y-5">
      <div className="flex flex-col items-center text-center py-4">
        <div className="w-16 h-16 rounded-full bg-green-50 border-4 border-green-100 flex items-center justify-center mb-4">
          <CheckCircle2 size={32} className="text-green-500" />
        </div>
        <h3 className="text-xl font-extrabold text-[#0F172A]">Shipment Booked!</h3>
        <p className="text-sm text-[#64748B] mt-2 max-w-xs leading-relaxed">
          Your shipment has been created. A courier will contact you within 2 hours to arrange pickup.
        </p>

        {/* Tracking number */}
        <div className="mt-4 flex items-center gap-2 px-5 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-full">
          <span className="text-base font-extrabold text-[#0F172A] tracking-tight font-mono">
            {trackingNumber}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="p-1 rounded-lg text-[#94A3B8] hover:text-[#64748B] hover:bg-[#E2E8F0] transition-colors"
            title="Copy tracking number"
          >
            <Copy size={14} />
          </button>
        </div>
        {copied && <p className="text-xs text-green-600 font-medium mt-1.5">Copied to clipboard!</p>}
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-2xl divide-y divide-[#F8FAFC]">
        {[
          { label: "Tracking #",  value: trackingNumber },
          { label: "Route",       value: `${formData.senderCity || "—"} → ${formData.recipientCity || "—"}` },
          { label: "Recipient",   value: `${formData.recipientFirstName} ${formData.recipientLastName}`.trim() || "—" },
          { label: "Service",     value: formData.serviceCode },
          { label: "ETA",         value: `${rate.etaDays} business days` },
          { label: "Total Paid",  value: `$${grandTotal.toFixed(2)}` },
        ].map((row) => (
          <div key={row.label} className="flex justify-between items-center px-5 py-3.5 text-sm">
            <span className="text-[#64748B]">{row.label}</span>
            <span className="font-semibold text-[#0F172A] text-right max-w-[55%] truncate">{row.value}</span>
          </div>
        ))}
      </div>

      <InfoBanner icon={CheckCircle2} color="green">
        Confirmation sent to <strong>{formData.senderEmail || "your email"}</strong>. The recipient will receive tracking updates automatically.
      </InfoBanner>
    </div>
  );
}

// ─── Step Progress Bar ─────────────────────────────────────────────────────────
function StepBar({ currentStep }) {
  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 mb-6 shadow-sm overflow-x-auto">
      <div className="flex items-center min-w-[520px]">
        {STEPS.map((step, i) => {
          const Icon   = step.icon;
          const done   = currentStep > step.id;
          const active = currentStep === step.id;
          return (
            <div key={step.id} className="flex-1 flex flex-col items-center relative">
              {/* Left connector */}
              {i > 0 && (
                <div className={`absolute left-0 right-1/2 top-4 h-0.5 ${done || active ? "bg-[#FFB800]" : "bg-[#E2E8F0]"}`} />
              )}
              {/* Right connector */}
              {i < STEPS.length - 1 && (
                <div className={`absolute left-1/2 right-0 top-4 h-0.5 ${done ? "bg-[#FFB800]" : "bg-[#E2E8F0]"}`} />
              )}
              <div className={`
                relative z-10 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all
                ${done   ? "bg-[#FFB800] border-[#FFB800]" : ""}
                ${active ? "bg-[#0F172A] border-[#0F172A] ring-4 ring-[#FFB800]/20" : ""}
                ${!done && !active ? "bg-white border-[#E2E8F0]" : ""}
              `}>
                {done
                  ? <Check size={13} className="text-[#0F172A]" />
                  : <Icon size={13} className={active ? "text-white" : "text-[#CBD5E1]"} />
                }
              </div>
              <span className={`text-[10px] mt-1.5 font-semibold text-center leading-tight
                ${active ? "text-[#0F172A]" : done ? "text-[#64748B]" : "text-[#CBD5E1]"}
              `}>
                {step.shortLabel}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── PAGE COMPONENT ────────────────────────────────────────────────────────────
export default function CreateShipmentPage() {
  const [currentStep,  setCurrentStep]  = useState(1);
  const [formData,     setFormData]     = useState(INITIAL_FORM_DATA);
  const [submitting,   setSubmitting]   = useState(false);
  const [submitError,  setSubmitError]  = useState(null);
  const [trackingNumber, setTrackingNumber] = useState("");

  // ─── Universal field updater ──────────────────────────────────────────────
  // Works for text, select, textarea (e.target.value),
  // checkboxes (e.target.checked), and synthetic radio events.
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }, []);

  // ─── Submit orchestration ─────────────────────────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    try {
      // 1. Compute logistics values
      const lengthCm  = parseFloat(formData.lengthCm)  || 0;
      const widthCm   = parseFloat(formData.widthCm)   || 0;
      const heightCm  = parseFloat(formData.heightCm)  || 0;
      const weightKg  = parseFloat(formData.weightKg)  || 0;
      const declaredValueUSD = parseFloat(formData.declaredValueUSD) || 0;

      const volumetricWeight = calculateVolumetricWeight({ lengthCm, widthCm, heightCm });
      const { chargeableWeight, basis } = calculateChargeableWeight({ actualWeight: weightKg, volumetricWeight });

      // 2. Estimate rate
      const rate = estimateRate({
        chargeableWeight,
        serviceCode: formData.serviceCode,
        declaredValueUSD,
        destinationCountryCode: formData.recipientCountry,
      });

      const addonsTotal = (formData.addInsurance ? 8 : 0) + (formData.addSignature ? 3.5 : 0);

      // 3. Generate tracking number (server-generated in production)
      const tn = generateTrackingNumber("INTL");
      setTrackingNumber(tn);

      // 4. Assemble shipment payload (clean, structured — ready for DB)
      const shipmentPayload = {
        trackingNumber: tn,
        currentStatus: "LABEL_CREATED",
        customerId: auth.currentUser?.uid || null,
        currentLocation: `${formData.senderCity || ""}${formData.senderCountry ? `, ${formData.senderCountry}` : ""}`,

        sender: {
          name:    `${formData.senderFirstName} ${formData.senderLastName}`.trim(),
          company: formData.senderCompany,
          email:   formData.senderEmail,
          phone:   formData.senderPhone,
          address: {
            line1:   formData.senderAddress1,
            city:    formData.senderCity,
            state:   formData.senderState,
            postal:  formData.senderPostal,
            country: formData.senderCountry,
          },
        },

        recipient: {
          name:    `${formData.recipientFirstName} ${formData.recipientLastName}`.trim(),
          company: formData.recipientCompany,
          email:   formData.recipientEmail,
          phone:   formData.recipientPhone,
          address: {
            line1:   formData.recipientAddress1,
            line2:   formData.recipientAddress2,
            city:    formData.recipientCity,
            state:   formData.recipientState,
            postal:  formData.recipientPostal,
            country: formData.recipientCountry,
          },
        },

        package: {
          type:              formData.packageType,
          contents:          formData.contents,
          fragile:           formData.fragile,
          keepUpright:       formData.keepUpright,
          dimensions:        { lengthCm, widthCm, heightCm },
          weightKg,
          volumetricWeight,
          chargeableWeight,
          chargeableBasis:   basis,
        },

        customs: {
          declaredValueUSD,
          hsCode:          formData.hsCode,
          originCountry:   formData.originCountry,
          purpose:         formData.shipmentPurpose,
        },

        pricing: {
          serviceCode:         formData.serviceCode,
          freightUSD:          rate.freightUSD,
          fuelSurchargeUSD:    rate.fuelSurchargeUSD,
          estimatedDutiesUSD:  rate.estimatedDutiesUSD,
          addonsUSD:           addonsTotal,
          totalUSD:            Math.round((rate.totalUSD + addonsTotal) * 100) / 100,
          etaDays:             rate.etaDays,
          addInsurance:        formData.addInsurance,
          addSignature:        formData.addSignature,
        },
      };

      // 5. Persist shipment to DB
      const shipmentRef = await createShipment(shipmentPayload);

      // 6. Write immutable LABEL_CREATED audit event
      await createShipmentEvent({
        shipmentId:  shipmentRef.id,
        status:      "LABEL_CREATED",
        description: "Shipment label created and booked via dashboard",
        location:    "Yellowduck System",
        author:      formData.senderEmail || "System",
      });

      // 7. Advance to confirmation
      setCurrentStep(7);
    } catch (err) {
      console.error("[CreateShipment] Error:", err);
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  // ─── Navigation ───────────────────────────────────────────────────────────
  function goNext() {
    setCurrentStep((s) => Math.min(STEPS.length, s + 1));
  }
  function goBack() {
    setCurrentStep((s) => Math.max(1, s - 1));
  }

  const isPaymentStep = currentStep === 6;
  const isConfirmStep = currentStep === 7;

  // ─── Render the correct step ───────────────────────────────────────────────
  function renderStep() {
    switch (currentStep) {
      case 1: return <StepSender     formData={formData} onChange={handleChange} />;
      case 2: return <StepRecipient  formData={formData} onChange={handleChange} />;
      case 3: return <StepPackage    formData={formData} onChange={handleChange} />;
      case 4: return <StepCustoms    formData={formData} onChange={handleChange} />;
      case 5: return <StepPricing    formData={formData} onChange={handleChange} />;
      case 6: return <StepPayment    formData={formData} onChange={handleChange} />;
      case 7: return <StepConfirm    formData={formData} trackingNumber={trackingNumber} />;
      default: return null;
    }
  }

  const stepLabel = STEPS[currentStep - 1]?.label ?? "";

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar title="Create Shipment" subtitle="New international shipment" />

        <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
          <div className="max-w-2xl mx-auto">

            {/* Step indicator */}
            <StepBar currentStep={currentStep} />

            {/* Step card */}
            <form onSubmit={handleSubmit} noValidate>
              <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm">

                {/* Card header */}
                <div className="px-6 sm:px-8 py-5 border-b border-[#F1F5F9]">
                  <h2 className="text-base font-extrabold text-[#0F172A]">
                    {isConfirmStep ? "Shipment Confirmed" : `Step ${currentStep} — ${stepLabel}`}
                  </h2>
                  {!isConfirmStep && (
                    <p className="text-xs text-[#94A3B8] mt-0.5">{currentStep} of {STEPS.length}</p>
                  )}
                </div>

                {/* Step content */}
                <div className="px-6 sm:px-8 py-6">
                  {renderStep()}

                  {/* Error message */}
                  {submitError && (
                    <div className="mt-4 flex items-center gap-2 p-3.5 bg-red-50 border border-red-100 rounded-xl">
                      <AlertTriangle size={14} className="text-red-500 flex-shrink-0" />
                      <p className="text-sm text-red-700">{submitError}</p>
                    </div>
                  )}
                </div>

                {/* Navigation footer — hidden on confirm step */}
                {!isConfirmStep && (
                  <div className="px-6 sm:px-8 py-5 border-t border-[#F1F5F9] flex items-center justify-between gap-4">

                    {/* Back button */}
                    <button
                      type="button"
                      onClick={goBack}
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

                    {/* Step dots */}
                    <div className="flex items-center gap-1">
                      {STEPS.map((s) => (
                        <div
                          key={s.id}
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            s.id === currentStep
                              ? "w-6 bg-[#FFB800]"
                              : s.id < currentStep
                              ? "w-2 bg-[#FFB800]/40"
                              : "w-2 bg-[#E2E8F0]"
                          }`}
                        />
                      ))}
                    </div>

                    {/* Next / Submit button */}
                    {isPaymentStep ? (
                      <button
                        type="submit"
                        disabled={submitting}
                        className="
                          flex items-center gap-2 px-6 py-2.5 rounded-xl
                          bg-[#FFB800] text-[#0F172A] text-sm font-bold
                          hover:bg-[#F0AE00] active:scale-[0.98]
                          disabled:opacity-60 disabled:cursor-not-allowed
                          transition-all shadow-sm
                        "
                      >
                        {submitting ? (
                          <>
                            <Loader2 size={15} className="animate-spin" />
                            Creating…
                          </>
                        ) : (
                          <>
                            <CheckCircle2 size={15} />
                            Confirm & Book
                          </>
                        )}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={goNext}
                        className="
                          flex items-center gap-2 px-5 py-2.5 rounded-xl
                          bg-[#FFB800] text-[#0F172A] text-sm font-bold
                          hover:bg-[#F0AE00] active:scale-[0.98] transition-all shadow-sm
                        "
                      >
                        {currentStep === STEPS.length - 1 ? "Review & Pay" : "Continue"}
                        <ChevronRight size={15} />
                      </button>
                    )}
                  </div>
                )}

                {isConfirmStep && (
                  <div className="px-6 sm:px-8 py-5 border-t border-[#F1F5F9] flex justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(INITIAL_FORM_DATA);
                        setTrackingNumber("");
                        setCurrentStep(1);
                      }}
                      className="px-5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm font-semibold text-[#64748B] hover:bg-[#F8FAFC] transition-all"
                    >
                      Create Another
                    </button>
                    <a
                      href="/dashboard"
                      className="px-5 py-2.5 rounded-xl bg-[#0F172A] text-white text-sm font-bold hover:bg-[#1E293B] transition-all"
                    >
                      Back to Dashboard
                    </a>
                  </div>
                )}
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}