"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Package,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Plane,
  Truck,
  Warehouse,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Shield,
  User,
  Calendar,
  Weight,
  Box,
  Thermometer,
  Flag,
  Copy,
  ExternalLink,
  RefreshCw,
} from "lucide-react";





import {
  doc,
  collection,
  onSnapshot,
  query,
  orderBy
}
from "firebase/firestore";

import { db }
from "@/lib/firebase/client";







// ─── Mock Data ─────────────────────────────────────────────────────────────────
const MOCK_SHIPMENT = {
  id: "YDK-INTL-000182",
  status: "IN_TRANSIT",
  statusLabel: "In Transit",
  origin: { city: "Lagos", country: "Nigeria", code: "LOS" },
  destination: { city: "New York", country: "United States", code: "JFK" },
  eta: "Jun 2, 2026",
  etaWindow: "2:00 PM – 6:00 PM",
  service: "Express International",
  carrier: "Yellowduck Air Network",
  weight: "3.4 kg",
  dimensions: "28 × 18 × 12 cm",
  declared_value: "$420.00",
  insurance: "Included",
  sender: "Chidi Okeke · Lagos, Nigeria",
  recipient: "Marcus Webb · New York, NY",
  progress: 65, // 0–100
};

const STEPS = [
  { key: "PICKED_UP",           label: "Picked Up",           icon: Package },
  { key: "CUSTOMS_CLEARANCE",   label: "Customs",             icon: Shield },
  { key: "IN_TRANSIT",          label: "In Transit",          icon: Plane },
  { key: "ARRIVED_DESTINATION", label: "Arrived",             icon: Warehouse },
  { key: "OUT_FOR_DELIVERY",    label: "Out for Delivery",    icon: Truck },
  { key: "DELIVERED",           label: "Delivered",           icon: CheckCircle2 },
];

const STEP_INDEX = {
  PICKED_UP: 0,
  CUSTOMS_CLEARANCE: 1,
  IN_TRANSIT: 2,
  ARRIVED_DESTINATION: 3,
  OUT_FOR_DELIVERY: 4,
  DELIVERED: 5,
};

const MOCK_TIMELINE = [
  {
    id: 1,
    status: "IN_TRANSIT",
    label: "Departed London Heathrow",
    location: "London Heathrow Hub · LHR-HUB-01",
    time: "Today, 2:10 PM",
    detail: "Flight YD4421 — Estimated arrival JFK 11:55 PM",
    icon: Plane,
    type: "milestone",
  },
  {
    id: 2,
    status: "CUSTOMS_CLEARANCE",
    label: "Customs Cleared — UK Export",
    location: "London Heathrow, United Kingdom",
    time: "Today, 11:45 AM",
    detail: "HS Code 8471.30 · Duties verified",
    icon: Shield,
    type: "normal",
  },
  {
    id: 3,
    status: "IN_TRANSIT",
    label: "Arrived at Transit Hub",
    location: "London Heathrow Hub · LHR-HUB-01",
    time: "Yesterday, 11:30 PM",
    detail: "Transferred from Lagos inbound flight YD1182",
    icon: Warehouse,
    type: "normal",
  },
  {
    id: 4,
    status: "CUSTOMS_CLEARANCE",
    label: "Customs Cleared — Nigeria Export",
    location: "Lagos Murtala Muhammed Airport, Nigeria",
    time: "Yesterday, 4:00 PM",
    detail: "Export documentation verified. Approved.",
    icon: Shield,
    type: "normal",
  },
  {
    id: 5,
    status: "PICKED_UP",
    label: "Package Picked Up",
    location: "Lagos, Nigeria",
    time: "Yesterday, 8:20 AM",
    detail: "Collected by Yellowduck courier #YD-NGR-44",
    icon: Package,
    type: "normal",
  },
  {
    id: 6,
    status: "LABEL_CREATED",
    label: "Label Created",
    location: "Yellowduck System",
    time: "May 21, 2026 · 3:14 PM",
    detail: "Shipment booked. Awaiting pickup.",
    icon: Package,
    type: "normal",
  },
];

const EXCEPTIONS = []; 


const STATUS_CONFIG = {
  IN_TRANSIT:       { bg: "bg-blue-50",   text: "text-blue-700",   dot: "bg-blue-500",   label: "In Transit" },
  DELIVERED:        { bg: "bg-green-50",  text: "text-green-700",  dot: "bg-green-500",  label: "Delivered" },
  CUSTOMS_HOLD:     { bg: "bg-amber-50",  text: "text-amber-700",  dot: "bg-amber-500",  label: "Customs Hold" },
  EXCEPTION:        { bg: "bg-red-50",    text: "text-red-700",    dot: "bg-red-500",    label: "Exception" },
  OUT_FOR_DELIVERY: { bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-500", label: "Out for Delivery" },
  PICKED_UP:        { bg: "bg-slate-50",  text: "text-slate-700",  dot: "bg-slate-400",  label: "Picked Up" },
};

function StatusBadge({ status, pulse = false }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG["PICKED_UP"];
  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
      <span className={`w-2 h-2 rounded-full ${cfg.dot} ${pulse ? "animate-pulse" : ""}`} />
      {cfg.label}
    </span>
  );
}

// ─── Progress Stepper ─────────────────────────────────────────────────────────
function ProgressStepper({ currentStatus }) {
  const currentIdx = STEP_INDEX[currentStatus] ?? 2;
  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="flex items-start min-w-[520px]">
        {STEPS.map((step, i) => {
          const Icon = step.icon;
          const done   = i < currentIdx;
          const active = i === currentIdx;
          const future = i > currentIdx;
          return (
            <div key={step.key} className="flex-1 flex flex-col items-center gap-2 relative">
              {/* Connector line left */}
              {i > 0 && (
                <div
                  className={`
                    absolute left-0 right-1/2 top-[19px] h-0.5
                    ${done || active ? "bg-[#FFB800]" : "bg-[#E2E8F0]"}
                  `}
                />
              )}
              {/* Connector line right */}
              {i < STEPS.length - 1 && (
                <div
                  className={`
                    absolute left-1/2 right-0 top-[19px] h-0.5
                    ${done ? "bg-[#FFB800]" : "bg-[#E2E8F0]"}
                  `}
                />
              )}

              {/* Circle */}
              <div
                className={`
                  relative z-10 w-10 h-10 rounded-full flex items-center justify-center
                  border-2 transition-all
                  ${done   ? "bg-[#FFB800] border-[#FFB800]" : ""}
                  ${active ? "bg-[#0F172A] border-[#0F172A] ring-4 ring-[#FFB800]/20" : ""}
                  ${future ? "bg-white border-[#E2E8F0]" : ""}
                `}
              >
                <Icon
                  size={16}
                  className={`
                    ${done   ? "text-[#0F172A]" : ""}
                    ${active ? "text-white" : ""}
                    ${future ? "text-[#CBD5E1]" : ""}
                  `}
                />
              </div>

              <span
                className={`text-[11px] font-semibold text-center leading-tight
                  ${active ? "text-[#0F172A]" : done ? "text-[#64748B]" : "text-[#CBD5E1]"}
                `}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Timeline Item ────────────────────────────────────────────────────────────
function TimelineItem({ event, isFirst }) {
  const Icon = event.icon;
  return (
    <div className="flex gap-4">
      {/* Left: icon + line */}
      <div className="flex flex-col items-center flex-shrink-0">
        <div
          className={`
            w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0
            ${isFirst
              ? "bg-[#0F172A] text-white ring-4 ring-[#FFB800]/20"
              : "bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B]"
            }
          `}
        >
          <Icon size={15} />
        </div>
        <div className="w-px flex-1 bg-[#E2E8F0] mt-2" />
      </div>

      {/* Right: content */}
      <div className="pb-6 flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className={`text-sm font-semibold ${isFirst ? "text-[#0F172A]" : "text-[#334155]"}`}>
              {event.label}
            </p>
            <p className="text-xs text-[#64748B] mt-0.5 flex items-center gap-1">
              <MapPin size={10} />
              {event.location}
            </p>
          </div>
          <time className="text-xs text-[#94A3B8] flex-shrink-0 flex items-center gap-1">
            <Clock size={10} />
            {event.time}
          </time>
        </div>
        {event.detail && (
          <p className="mt-1.5 text-xs text-[#94A3B8] bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-3 py-2">
            {event.detail}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Detail Row ───────────────────────────────────────────────────────────────
function DetailRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 border-b border-[#F1F5F9] last:border-0">
      <div className="flex items-center gap-2.5 text-sm text-[#64748B]">
        <Icon size={14} className="flex-shrink-0 text-[#94A3B8]" />
        {label}
      </div>
      <span className="text-sm font-semibold text-[#0F172A] text-right">{value}</span>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function TrackingPage({ params }) {
  const trackingId = params?.id || "YDK-INTL-000182";
  const ship = MOCK_SHIPMENT;
  const [copied, setCopied] = useState(false);
  const [showAll, setShowAll] = useState(false);
  



  const [shipment, setShipment] = useState(null);

  const [events, setEvents] = useState([]);

  const [loading, setLoading] =useState(true);

  const [error, setError] = useState(null);

  useEffect(() => {

  const shipmentRef = doc(
    db,
    "shipments",
    trackingId
  );

  const unsubShipment =
    onSnapshot(

      shipmentRef,

      (snapshot) => {

        if (!snapshot.exists()) {

          setError(
            "Tracking ID not found"
          );

          setLoading(false);

          return;
        }

        setShipment(snapshot.data());

        setLoading(false);
      },

      (err) => {

        console.error(err);

        setError(
          "Failed to load shipment"
        );

        setLoading(false);
      }
    );

  return () => unsubShipment();

}, [trackingId]);


  useEffect(() => {

  const eventsRef = collection(
    db,
    "shipments",
    trackingId,
    "events"
  );

  const q = query(
    eventsRef,
    orderBy("timestamp", "desc")
  );

  const unsubEvents =
    onSnapshot(q, (snapshot) => {

      const eventData =
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));

      setEvents(eventData);
    });

  return () => unsubEvents();

}, [trackingId]);



  const visibleEvents = showAll ? MOCK_TIMELINE : MOCK_TIMELINE.slice(0, 3);

  const handleCopy = () => {
    navigator.clipboard.writeText(ship.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">

        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-[#64748B] hover:text-[#0F172A] transition-colors mb-6"
        >
          <ArrowLeft size={15} />
          Back to home
        </Link>

        {/* ── Shipment Header Card ──────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
                  {shipment?.id || "YDK-INTL-000182"  }
                </h1>
                <button
                  onClick={handleCopy}
                  className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#64748B] hover:bg-[#F1F5F9] transition-colors"
                  title="Copy tracking number"
                >
                  <Copy size={14} />
                </button>
                {copied && (
                  <span className="text-xs text-green-600 font-medium">Copied!</span>
                )}
              </div>

              <div className="flex items-center gap-2 text-sm text-[#64748B]">
                <span className="font-medium text-[#334155]">{shipment?.origin?.city || ship.origin.city}</span>
                <span className="text-[#CBD5E1]">→</span>
                <span className="font-medium text-[#334155]">{shipment?.destination?.city || ship.destination.city}</span>
                <span className="hidden sm:inline text-[#CBD5E1]">·</span>
                <span className="hidden sm:inline">{shipment?.service || ship.service}</span>
              </div>
            </div>

            <div className="flex flex-col items-start sm:items-end gap-2">
              <StatusBadge status={shipment?.status || ship.status} pulse={shipment?.status === "IN_TRANSIT" || ship.status === "IN_TRANSIT"} />
              <button className="inline-flex items-center gap-1.5 text-xs text-[#94A3B8] hover:text-[#64748B] transition-colors">
                <RefreshCw size={11} />
                Refresh status
              </button>
            </div>
          </div>

          {/* ETA Banner */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <div className="flex-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-5 py-4">
              <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wide mb-1">
                Estimated Delivery
              </p>
              <p className="text-xl font-extrabold text-[#0F172A]">{shipment?.eta || ship.eta}</p>
              <p className="text-sm text-[#64748B] mt-0.5">{shipment?.etaWindow || ship.etaWindow} · {shipment?.destination?.city || ship.destination.city}</p>
            </div>
            <div className="flex-1 bg-[#FFF8E6] border border-[#FFB800]/30 rounded-xl px-5 py-4">
              <p className="text-xs font-semibold text-[#92670A] uppercase tracking-wide mb-1">
                Carrier
              </p>
              <p className="text-sm font-bold text-[#0F172A]">{shipment?.carrier || ship.carrier}</p>
              <p className="text-sm text-[#64748B] mt-0.5">Flight YD4421 · In air</p>
            </div>
          </div>
        </div>

        {/* ── Progress Stepper ─────────────────────────────────── */}
        <div className="mt-6 bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 shadow-sm">
          <h2 className="text-sm font-semibold text-[#334155] mb-6">Shipment Progress</h2>
          <ProgressStepper currentStatus={shipment?.status || ship.status} />

          {/* Thin progress bar */}
          <div className="mt-6 bg-[#F1F5F9] rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full bg-[#FFB800] rounded-full transition-all duration-700"
              style={{ width: `${shipment?.progress || ship.progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[11px] text-[#94A3B8]">{shipment?.origin?.city || ship.origin.city}</span>
            <span className="text-[11px] text-[#94A3B8]">{shipment?.destination?.city || ship.destination.city}</span>
          </div>
        </div>

        {/* ── Main Content Grid ─────────────────────────────────── */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left: Timeline (2/3) */}
          <div className="lg:col-span-2 space-y-6">

            {/* Exceptions (shown only if any) */}
            {EXCEPTIONS.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle size={16} className="text-red-600" />
                  <h3 className="text-sm font-semibold text-red-700">Active Exception</h3>
                </div>
                {EXCEPTIONS.map((ex) => (
                  <p key={ex.id} className="text-sm text-red-600">{ex.message}</p>
                ))}
              </div>
            )}

            {/* Map placeholder */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-sm">
              <div
                className="relative h-48 sm:h-56 bg-gradient-to-br from-[#EBF4FF] to-[#F0F7FF] flex items-center justify-center"
                style={{
                  backgroundImage: `
                    radial-gradient(circle at 25% 50%, rgba(255,184,0,0.12) 0%, transparent 40%),
                    radial-gradient(circle at 75% 50%, rgba(59,130,246,0.08) 0%, transparent 40%)
                  `,
                }}
              >
                {/* Decorative route line */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 220" fill="none" preserveAspectRatio="none">
                  <path
                    d="M 80 140 Q 200 30 520 100"
                    stroke="#FFB800"
                    strokeWidth="2"
                    strokeDasharray="6 4"
                    fill="none"
                    opacity="0.6"
                  />
                  {/* Origin dot */}
                  <circle cx="80" cy="140" r="6" fill="#FFB800" />
                  <circle cx="80" cy="140" r="10" fill="#FFB800" fillOpacity="0.2" />
                  {/* Current position */}
                  <circle cx="310" cy="68" r="8" fill="#0F172A" />
                  <circle cx="310" cy="68" r="14" fill="#0F172A" fillOpacity="0.15" />
                  {/* Destination dot */}
                  <circle cx="520" cy="100" r="6" fill="#64748B" opacity="0.4" />
                </svg>

                {/* Labels */}
                <div className="absolute left-8 bottom-8 text-xs font-semibold text-[#0F172A]">Lagos, NG</div>
                <div className="absolute right-8 bottom-10 text-xs font-semibold text-[#94A3B8]">New York, US</div>
                <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-[#0F172A]/80 text-white px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm">
                  <Plane size={12} className="text-[#FFB800]" />
                  Flight YD4421 · In air
                </div>

                {/* Map coming soon badge */}
                <div className="absolute bottom-4 right-4 text-[10px] text-[#CBD5E1] bg-white/70 border border-[#E2E8F0] px-2 py-1 rounded-full">
                  Live map · Coming soon
                </div>
              </div>
            </div>

            {/* Live Timeline */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm font-semibold text-[#334155]">Live Timeline</h2>
                <span className="inline-flex items-center gap-1.5 text-xs text-[#64748B]">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  Live updates
                </span>
              </div>

              <div>
                {visibleEvents.map((event, i) => (
                  <TimelineItem key={event.id} event={event} isFirst={i === 0} />
                ))}
              </div>

              {MOCK_TIMELINE.length > 3 && (
                <button
                  onClick={() => setShowAll((v) => !v)}
                  className="w-full mt-2 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-[#64748B] hover:text-[#0F172A] border border-[#E2E8F0] rounded-xl hover:bg-[#F8FAFC] transition-colors"
                >
                  {showAll ? (
                    <><ChevronUp size={13} /> Show less</>
                  ) : (
                    <><ChevronDown size={13} /> Show {MOCK_TIMELINE.length - 3} earlier events</>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Right: Details (1/3) */}
          <div className="space-y-6">

            {/* Package Details */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-[#334155] mb-1">Package Details</h3>
              <div className="mt-3">
                <DetailRow icon={Weight}    label="Weight"        value={ship.weight} />
                <DetailRow icon={Box}       label="Dimensions"    value={ship.dimensions} />
                <DetailRow icon={Flag}      label="Declared Value" value={ship.declared_value} />
                <DetailRow icon={Shield}    label="Insurance"     value={ship.insurance} />
              </div>
            </div>

            {/* Route Details */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-[#334155] mb-3">Route</h3>
              <div>
                <DetailRow icon={User}      label="Sender"        value={ship.sender} />
                <DetailRow icon={MapPin}    label="Recipient"     value={ship.recipient} />
                <DetailRow icon={Truck}     label="Service"       value={ship.service} />
                <DetailRow icon={Calendar}  label="ETA"           value={ship.eta} />
              </div>
            </div>

            {/* Support CTA */}
            <div className="bg-[#0F172A] rounded-2xl p-6 space-y-3">
              <h3 className="text-sm font-semibold text-white">Need help?</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Our support team monitors all active international shipments 24/7.
              </p>
              <a
                href="mailto:hello@yellowduck.io"
                className="
                  flex items-center justify-center gap-2 w-full py-2.5 rounded-xl
                  bg-[#FFB800] text-[#0F172A] text-xs font-bold
                  hover:bg-[#F0AE00] transition-colors
                "
              >
                Contact Support
                <ExternalLink size={11} />
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}