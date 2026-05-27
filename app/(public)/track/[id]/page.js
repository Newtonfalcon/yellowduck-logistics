"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import Navbar from "@/components/nav/Navbar";
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
  getShipment,
  getShipmentByTrackingNumber,
  getShipmentEvents,
} from "@/services/shipment.service";

const LeafletMap = dynamic(() => import("@/components/tracking/LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="h-56 bg-gradient-to-br from-[#EBF4FF] to-[#F0F7FF] flex items-center justify-center">
      <div className="flex items-center gap-2 text-[#64748B] text-sm">
        <div className="w-4 h-4 border-2 border-[#FFB800] border-t-transparent rounded-full animate-spin" />
        Loading map…
      </div>
    </div>
  ),
});

const CITY_COORDS = {
  lagos: [6.5244, 3.3792],
  ikeja: [6.6018, 3.3515],
  "new york": [40.7128, -74.0060],
  "new york city": [40.7128, -74.0060],
  nyc: [40.7128, -74.0060],
  "los angeles": [34.0522, -118.2437],
  la: [34.0522, -118.2437],
  chicago: [41.8781, -87.6298],
  houston: [29.7604, -95.3698],
  miami: [25.7617, -80.1918],
  toronto: [43.6532, -79.3832],
  montreal: [45.5017, -73.5673],
  london: [51.5074, -0.1278],
  paris: [48.8566, 2.3522],
  amsterdam: [52.3676, 4.9041],
  dubai: [25.2048, 55.2708],
  singapore: [1.3521, 103.8198],
  frankfurt: [50.1109, 8.6821],
  shanghai: [31.2304, 121.4737],
  "hong kong": [22.3193, 114.1694],
  tokyo: [35.6762, 139.6503],
  sydney: [-33.8688, 151.2093],
  mumbai: [19.0760, 72.8777],
  delhi: [28.7041, 77.1025],
  beijing: [39.9042, 116.4074],
  berlin: [52.5200, 13.4050],
  rome: [41.9028, 12.4964],
  madrid: [40.4168, -3.7038],
  "mexico city": [19.4326, -99.1332],
  mexico: [19.4326, -99.1332],
  seoul: [37.5665, 126.9780],
  jakarta: [-6.2088, 106.8456],
  "buenos aires": [-34.6037, -58.3816],
  "sao paulo": [-23.5505, -46.6333],
  rio: [-22.9068, -43.1729],
};

const COUNTRY_COORDS = {
  nigeria: [9.0820, 8.6753],
  "united states": [39.8283, -98.5795],
  usa: [39.8283, -98.5795],
  us: [39.8283, -98.5795],
  "united kingdom": [55.3781, -3.4360],
  uk: [55.3781, -3.4360],
  germany: [51.1657, 10.4515],
  france: [46.2276, 2.2137],
  china: [35.8617, 104.1954],
  india: [20.5937, 78.9629],
  australia: [-25.2744, 133.7751],
  canada: [56.1304, -106.3468],
};

function parseLatLng(locationString) {
  if (!locationString || typeof locationString !== "string") return null;
  const match = locationString.match(/(-?\d+(?:\.\d+)?)[,\s]+(-?\d+(?:\.\d+)?)/);
  if (!match) return null;
  const lat = parseFloat(match[1]);
  const lng = parseFloat(match[2]);
  if (Number.isFinite(lat) && Number.isFinite(lng)) {
    return [lat, lng];
  }
  return null;
}

function getCityCoords(locationString) {
  if (!locationString) return null;
  const normalized = locationString.toString().trim().toLowerCase();
  const explicit = parseLatLng(normalized);
  if (explicit) return explicit;

  for (const [city, coords] of Object.entries(CITY_COORDS)) {
    if (normalized.includes(city)) return coords;
  }

  for (const [country, coords] of Object.entries(COUNTRY_COORDS)) {
    if (normalized.includes(country)) return coords;
  }

  return null;
}

function resolveCoords(location) {
  if (!location) return null;
  if (Array.isArray(location) && location.length === 2) {
    const [lat, lng] = location;
    if (typeof lat === "number" && typeof lng === "number") return [lat, lng];
  }

  if (typeof location === "object") {
    const lat = location.latitude ?? location.lat ?? location.latitud ?? location.lat;
    const lng = location.longitude ?? location.lng ?? location.long ?? location.lon ?? location.lng;
    if (typeof lat === "number" && typeof lng === "number") {
      return [lat, lng];
    }

    const parts = [location.city, location.state, location.region, location.country]
      .filter(Boolean)
      .join(", ");
    const addressCoords = getCityCoords(parts);
    if (addressCoords) return addressCoords;
  }

  if (typeof location === "string") {
    return getCityCoords(location);
  }

  return null;
}

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

const EVENT_ICON_BY_STATUS = {
  LABEL_CREATED: Package,
  PICKED_UP: Package,
  CUSTOMS_CLEARANCE: Shield,
  CUSTOMS_HOLD: Shield,
  IN_TRANSIT: Plane,
  ARRIVED_DESTINATION: Warehouse,
  OUT_FOR_DELIVERY: Truck,
  DELIVERED: CheckCircle2,
  EXCEPTION: AlertTriangle,
};

const PROGRESS_PERCENT = {
  LABEL_CREATED: 10,
  PICKED_UP: 25,
  CUSTOMS_CLEARANCE: 40,
  CUSTOMS_HOLD: 40,
  IN_TRANSIT: 60,
  ARRIVED_DESTINATION: 80,
  OUT_FOR_DELIVERY: 90,
  DELIVERED: 100,
  EXCEPTION: 50,
};

function getProgressPercent(status) {
  return PROGRESS_PERCENT[status] ?? 50;
}

function formatEventDate(timestamp) {
  if (!timestamp) return "Unknown time";
  if (typeof timestamp.toDate === "function") {
    return timestamp.toDate().toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }
  return new Date(timestamp).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}


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
  const trackingId = params?.id || "";
  const [copied, setCopied] = useState(false);
  const [showAll, setShowAll] = useState(false);
  



  const [shipment, setShipment] = useState(null);

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(Boolean(trackingId));
  const [error, setError] = useState(trackingId ? null : "Tracking ID not provided.");

  const loadShipment = async () => {
    if (!trackingId) return;

    setLoading(true);
    setError(null);

    try {
      const data = await getShipment(trackingId);
      if (data) {
        setShipment(data);
        return;
      }

      const fallbackData = await getShipmentByTrackingNumber(trackingId);
      if (fallbackData) {
        setShipment(fallbackData);
        return;
      }

      setError("Tracking ID not found.");
    } catch (err) {
      console.error(err);
      setError("Failed to load shipment.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShipment();
  }, [trackingId]);


  useEffect(() => {
    if (!shipment?.id) {
      return;
    }

    async function loadEvents() {
      try {
        const eventData = await getShipmentEvents(shipment.id, { order: "desc" });
        setEvents(eventData);
      } catch (err) {
        console.error(err);
      }
    }

    loadEvents();
  }, [shipment?.id]);

  const timelineEvents = (shipment?.id ? events : []).map((event) => ({
    id: event.id,
    status: event.status,
    label: event.description || STATUS_CONFIG[event.status]?.label || event.status,
    location: event.location || STATUS_CONFIG[event.status]?.label || "Unknown location",
    time: formatEventDate(event.timestamp),
    detail: event.author ? `Updated by ${event.author}` : undefined,
    icon: EVENT_ICON_BY_STATUS[event.status] ?? Package,
    type: event.status === "EXCEPTION" ? "warn" : "normal",
  }));

  const visibleEvents = showAll ? timelineEvents : timelineEvents.slice(0, 3);
  const exceptions = timelineEvents.filter((event) => event.status === "EXCEPTION");

  const originText = shipment?.sender?.address?.city || shipment?.sender?.address?.country || "Unknown";
  const destinationText = shipment?.recipient?.address?.city || shipment?.recipient?.address?.country || "Unknown";
  const serviceText = shipment?.pricing?.serviceCode || "Standard";
  const etaText = shipment?.pricing?.etaDays != null ? `In ${shipment.pricing.etaDays} days` : shipment?.pricing?.etaDate || "TBD";
  const carrierText = shipment?.carrier || "Yellowduck Logistics";
  const progressValue = shipment?.progress != null ? shipment.progress : getProgressPercent(shipment?.currentStatus);
  const weightText = shipment?.package?.weightKg ? `${shipment.package.weightKg} kg` : "TBD";
  const currentLocText = shipment?.currentLocation || timelineEvents[0]?.location || originText;
  const originCoords = resolveCoords(shipment?.sender?.address) || getCityCoords(originText);
  const destCoords = resolveCoords(shipment?.recipient?.address) || getCityCoords(destinationText);
  const currentCoords = resolveCoords(shipment?.currentLocation) || resolveCoords(timelineEvents[0]?.location) || originCoords;
  const dimensionsText = shipment?.package?.dimensions
    ? `${shipment.package.dimensions.lengthCm} × ${shipment.package.dimensions.widthCm} × ${shipment.package.dimensions.heightCm} cm`
    : "TBD";
  const declaredValueText = shipment?.customs?.declaredValueUSD ? `$${shipment.customs.declaredValueUSD}` : "TBD";
  const insuranceText = shipment?.pricing?.addInsurance ? "Included" : "Not included";
  const senderText = shipment?.sender?.name
    ? `${shipment.sender.name} · ${[shipment.sender.address?.city, shipment.sender.address?.country].filter(Boolean).join(", ")}`
    : "Unknown";
  const recipientText = shipment?.recipient?.name
    ? `${shipment.recipient.name} · ${[shipment.recipient.address?.city, shipment.recipient.address?.country].filter(Boolean).join(", ")}`
    : "Unknown";

  const handleCopy = () => {
    navigator.clipboard.writeText(shipment?.trackingNumber || trackingId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-8 shadow-sm text-center">
            <p className="text-sm text-[#64748B]">Loading shipment details…</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <div className="bg-white rounded-2xl border border-red-200 p-8 shadow-sm text-center">
            <p className="text-sm font-semibold text-red-700 mb-4">{error}</p>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full bg-[#FFB800] px-4 py-2 text-sm font-semibold text-[#0F172A] hover:bg-[#F0AE00] transition-colors"
            >
              Back to home
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

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
                  {shipment?.trackingNumber || shipment?.id || trackingId}
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
                <span className="font-medium text-[#334155]">{originText}</span>
                <span className="text-[#CBD5E1]">→</span>
                <span className="font-medium text-[#334155]">{destinationText}</span>
                <span className="hidden sm:inline text-[#CBD5E1]">·</span>
                <span className="hidden sm:inline">{serviceText}</span>
              </div>
            </div>

            <div className="flex flex-col items-start sm:items-end gap-2">
              <StatusBadge status={shipment?.currentStatus || "LABEL_CREATED"} pulse={(shipment?.currentStatus || "LABEL_CREATED") === "IN_TRANSIT"} />
              <button
                type="button"
                onClick={loadShipment}
                className="inline-flex items-center gap-1.5 text-xs text-[#94A3B8] hover:text-[#64748B] transition-colors"
              >
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
              <p className="text-xl font-extrabold text-[#0F172A]">{etaText}</p>
              <p className="text-sm text-[#64748B] mt-0.5">{destinationText}</p>
            </div>
            <div className="flex-1 bg-[#FFF8E6] border border-[#FFB800]/30 rounded-xl px-5 py-4">
              <p className="text-xs font-semibold text-[#92670A] uppercase tracking-wide mb-1">
                Carrier
              </p>
              <p className="text-sm font-bold text-[#0F172A]">{carrierText}</p>
              <p className="text-sm text-[#64748B] mt-0.5">Flight YD4421 · In air</p>
            </div>
          </div>
        </div>

        {/* ── Progress Stepper ─────────────────────────────────── */}
        <div className="mt-6 bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 shadow-sm">
          <h2 className="text-sm font-semibold text-[#334155] mb-6">Shipment Progress</h2>
          <ProgressStepper currentStatus={shipment?.currentStatus || "LABEL_CREATED"} />

          {/* Thin progress bar */}
          <div className="mt-6 bg-[#F1F5F9] rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full bg-[#FFB800] rounded-full transition-all duration-700"
              style={{ width: `${progressValue}%` }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[11px] text-[#94A3B8]">{originText}</span>
            <span className="text-[11px] text-[#94A3B8]">{destinationText}</span>
          </div>
        </div>

        {/* ── Main Content Grid ─────────────────────────────────── */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left: Timeline (2/3) */}
          <div className="lg:col-span-2 space-y-6">

            {/* Exceptions (shown only if any) */}
            {exceptions.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle size={16} className="text-red-600" />
                  <h3 className="text-sm font-semibold text-red-700">Active Exception</h3>
                </div>
                {exceptions.map((ex) => (
                  <p key={ex.id} className="text-sm text-red-600">{ex.label}</p>
                ))}
              </div>
            )}

            {/* Map */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-sm">
              {originCoords && destCoords ? (
                <LeafletMap
                  origin={originCoords}
                  destination={destCoords}
                  current={currentCoords}
                  originLabel={originText}
                  destinationLabel={destinationText}
                  currentLabel={currentLocText}
                  status={shipment?.currentStatus}
                />
              ) : (
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
                  <div className="absolute left-8 bottom-8 text-xs font-semibold text-[#0F172A]">{originText}</div>
                  <div className="absolute right-8 bottom-10 text-xs font-semibold text-[#94A3B8]">{destinationText}</div>
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-[#0F172A]/80 text-white px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm">
                    <Plane size={12} className="text-[#FFB800]" />
                    {carrierText} · In transit
                  </div>

                  {/* Map fallback badge */}
                  <div className="absolute bottom-4 right-4 text-[10px] text-[#CBD5E1] bg-white/70 border border-[#E2E8F0] px-2 py-1 rounded-full">
                    Map data unavailable
                  </div>
                </div>
              )}
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

              {timelineEvents.length > 3 && (
                <button
                  onClick={() => setShowAll((v) => !v)}
                  className="w-full mt-2 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-[#64748B] hover:text-[#0F172A] border border-[#E2E8F0] rounded-xl hover:bg-[#F8FAFC] transition-colors"
                >
                  {showAll ? (
                    <><ChevronUp size={13} /> Show less</>
                  ) : (
                    <><ChevronDown size={13} /> Show {timelineEvents.length - 3} earlier events</>
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
                <DetailRow icon={Weight}    label="Weight"        value={weightText} />
                <DetailRow icon={Box}       label="Dimensions"    value={dimensionsText} />
                <DetailRow icon={Flag}      label="Declared Value" value={declaredValueText} />
                <DetailRow icon={Shield}    label="Insurance"     value={insuranceText} />
              </div>
            </div>

            {/* Route Details */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-[#334155] mb-3">Route</h3>
              <div>
                <DetailRow icon={User}      label="Sender"        value={senderText} />
                <DetailRow icon={MapPin}    label="Recipient"     value={recipientText} />
                <DetailRow icon={Truck}     label="Service"       value={serviceText} />
                <DetailRow icon={Calendar}  label="ETA"           value={etaText} />
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