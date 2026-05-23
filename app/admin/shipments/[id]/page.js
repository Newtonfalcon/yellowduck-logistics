"use client";

import { useState } from "react";
import Sidebar from "@/components/nav/Sidebar";
import Topbar from "@/app/dashboard/components/Navbar";
import Link from "next/link";
import {
  ArrowLeft,
  Package,
  MapPin,
  Clock,
  Shield,
  AlertTriangle,
  CheckCircle2,
  Plane,
  Truck,
  Warehouse,
  User,
  Edit3,
  Plus,
  Save,
  ChevronDown,
  Flag,
  Activity,
  FileText,
  RotateCcw,
} from "lucide-react";

// ─── Mock Shipment ─────────────────────────────────────────────────────────────
const SHIPMENT = {
  id: "YDK-INTL-000182",
  status: "IN_TRANSIT",
  priority: "EXPRESS",
  origin: { city: "Lagos", country: "Nigeria", code: "LOS" },
  destination: { city: "New York", country: "United States", code: "JFK" },
  sender: { name: "Chidi Okeke", email: "chidi@example.com", phone: "+234 812 000 0001" },
  recipient: { name: "Marcus Webb", email: "marcus@example.com", phone: "+1 212 555 0192" },
  carrier: "Yellowduck Air Network",
  flightNo: "YD4421",
  facility: "LHR-HUB-01",
  weight: "3.4 kg",
  dimensions: "28 × 18 × 12 cm",
  declared_value: "$420.00",
  commodity: "Electronic Accessories",
  hs_code: "8471.30",
  eta: "Jun 2, 2026",
  service: "Express International",
  insurance: "Included — up to $1,000",
};

const TIMELINE = [
  { id: 1, label: "Departed London Heathrow", location: "LHR-HUB-01", time: "Today 14:10", type: "milestone", icon: Plane, author: "System" },
  { id: 2, label: "Customs Cleared — UK Export", location: "London Heathrow", time: "Today 11:45", type: "customs", icon: Shield, author: "Officer Smith" },
  { id: 3, label: "Arrived at LHR Transit Hub", location: "LHR-HUB-01", time: "Yesterday 23:30", type: "normal", icon: Warehouse, author: "System" },
  { id: 4, label: "Customs Cleared — Nigeria Export", location: "LOS-HUB-01", time: "Yesterday 16:00", type: "customs", icon: Shield, author: "Officer Adeyemi" },
  { id: 5, label: "Picked Up by Courier", location: "Lagos, Nigeria", time: "Yesterday 08:20", type: "milestone", icon: Package, author: "Courier #YD-NGR-44" },
];

const STATUS_OPTIONS = [
  "PICKED_UP", "CUSTOMS_CLEARANCE", "IN_TRANSIT",
  "ARRIVED_DESTINATION", "OUT_FOR_DELIVERY", "DELIVERED", "EXCEPTION",
];

const AUDIT = [
  { id: 1, user: "System",        action: "Status updated: IN_TRANSIT",     time: "14:10 today" },
  { id: 2, user: "Officer Smith", action: "Customs approved — UK export",    time: "11:45 today" },
  { id: 3, user: "Admin J.Doe",   action: "Priority escalated to EXPRESS",   time: "09:00 today" },
  { id: 4, user: "System",        action: "Shipment created and booked",     time: "May 21 15:14" },
];

// ─── Shared UI ─────────────────────────────────────────────────────────────────
function SectionCard({ title, icon: Icon, iconColor = "text-[#64748B]", children, action }) {
  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#F1F5F9]">
        <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
          {Icon && <Icon size={14} className={iconColor} />}
          {title}
        </h3>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between items-start py-2.5 border-b border-[#F8FAFC] last:border-0 gap-4">
      <span className="text-xs text-[#94A3B8] font-medium flex-shrink-0">{label}</span>
      <span className="text-xs font-semibold text-[#334155] text-right">{value}</span>
    </div>
  );
}

const STATUS_BADGE = {
  IN_TRANSIT:       "bg-blue-50 text-blue-700",
  DELIVERED:        "bg-green-50 text-green-700",
  CUSTOMS_HOLD:     "bg-amber-50 text-amber-700",
  OUT_FOR_DELIVERY: "bg-purple-50 text-purple-700",
  EXCEPTION:        "bg-red-50 text-red-700",
  PICKED_UP:        "bg-slate-50 text-slate-700",
};

const TIMELINE_STYLE = {
  milestone: "bg-[#0F172A] text-white ring-4 ring-[#FFB800]/20",
  customs:   "bg-amber-50 text-amber-600 border border-amber-200",
  normal:    "bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0]",
};

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AdminShipmentDetailPage({ params }) {
  const shipId = params?.id ?? "YDK-INTL-000182";
  const [newEventLabel, setNewEventLabel] = useState("");
  const [newEventLocation, setNewEventLocation] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(SHIPMENT.status);
  const [exceptionNote, setExceptionNote] = useState("");
  const [facility, setFacility] = useState(SHIPMENT.facility);

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      <Sidebar isAdmin />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar title={shipId} subtitle="Admin shipment detail" />

        <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">

          {/* Back + Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <Link href="/admin" className="p-2 rounded-xl border border-[#E2E8F0] text-[#64748B] hover:bg-white transition-colors">
                <ArrowLeft size={16} />
              </Link>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-extrabold text-[#0F172A]">{SHIPMENT.id}</h2>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_BADGE[SHIPMENT.status]}`}>
                    {SHIPMENT.status.replace(/_/g, " ")}
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#FFB800]/15 text-[#92670A]">
                    {SHIPMENT.priority}
                  </span>
                </div>
                <p className="text-sm text-[#64748B] mt-0.5">
                  {SHIPMENT.origin.city} → {SHIPMENT.destination.city} · {SHIPMENT.carrier}
                </p>
              </div>
            </div>
          </div>

          {/* Main grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

            {/* Left column — Summary + Status Updater + Customs + Routing */}
            <div className="space-y-6">

              {/* Shipment Summary */}
              <SectionCard title="Shipment Summary" icon={Package} iconColor="text-blue-500">
                <InfoRow label="Route"         value={`${SHIPMENT.origin.city} → ${SHIPMENT.destination.city}`} />
                <InfoRow label="Service"       value={SHIPMENT.service} />
                <InfoRow label="Weight"        value={SHIPMENT.weight} />
                <InfoRow label="Dimensions"    value={SHIPMENT.dimensions} />
                <InfoRow label="Carrier"       value={SHIPMENT.carrier} />
                <InfoRow label="Flight"        value={SHIPMENT.flightNo} />
                <InfoRow label="ETA"           value={SHIPMENT.eta} />
                <InfoRow label="Insurance"     value={SHIPMENT.insurance} />
              </SectionCard>

              {/* Sender / Recipient */}
              <SectionCard title="Parties" icon={User} iconColor="text-purple-500">
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-wider mb-1.5">Sender</p>
                    <p className="text-sm font-semibold text-[#0F172A]">{SHIPMENT.sender.name}</p>
                    <p className="text-xs text-[#64748B]">{SHIPMENT.sender.email}</p>
                    <p className="text-xs text-[#64748B]">{SHIPMENT.sender.phone}</p>
                  </div>
                  <div className="border-t border-[#F1F5F9] pt-4">
                    <p className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-wider mb-1.5">Recipient</p>
                    <p className="text-sm font-semibold text-[#0F172A]">{SHIPMENT.recipient.name}</p>
                    <p className="text-xs text-[#64748B]">{SHIPMENT.recipient.email}</p>
                    <p className="text-xs text-[#64748B]">{SHIPMENT.recipient.phone}</p>
                  </div>
                </div>
              </SectionCard>

              {/* Status Updater */}
              <SectionCard
                title="Update Status"
                icon={Edit3}
                iconColor="text-[#FFB800]"
              >
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#334155] mb-1.5">New Status</label>
                    <div className="relative">
                      <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="
                          w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0]
                          text-sm font-semibold text-[#0F172A] bg-[#F8FAFC]
                          focus:outline-none focus:border-[#FFB800] appearance-none
                        "
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
                        ))}
                      </select>
                      <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#334155] mb-1.5">Note (optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Delayed at customs gate 7"
                      value={exceptionNote}
                      onChange={(e) => setExceptionNote(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] text-sm bg-[#F8FAFC] focus:outline-none focus:border-[#FFB800] placeholder:text-[#CBD5E1]"
                    />
                  </div>
                  <button className="
                    flex items-center justify-center gap-2 w-full py-2.5 rounded-xl
                    bg-[#0F172A] text-white text-sm font-bold
                    hover:bg-[#1E293B] active:scale-[0.98] transition-all
                  ">
                    <Save size={14} />
                    Save Status
                  </button>
                </div>
              </SectionCard>
            </div>

            {/* Middle column — Timeline + Add Event */}
            <div className="space-y-6">
              <SectionCard
                title="Live Timeline"
                icon={Activity}
                iconColor="text-green-500"
                action={
                  <span className="flex items-center gap-1 text-[11px] text-green-600 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    Live
                  </span>
                }
              >
                <div className="space-y-0">
                  {TIMELINE.map((event, i) => {
                    const Icon = event.icon;
                    return (
                      <div key={event.id} className="flex gap-3">
                        <div className="flex flex-col items-center flex-shrink-0">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${TIMELINE_STYLE[event.type]}`}>
                            <Icon size={13} />
                          </div>
                          {i < TIMELINE.length - 1 && (
                            <div className="w-px flex-1 bg-[#E2E8F0] my-1" />
                          )}
                        </div>
                        <div className="pb-5 flex-1 min-w-0">
                          <p className="text-xs font-semibold text-[#0F172A] leading-tight">{event.label}</p>
                          <p className="text-[11px] text-[#64748B] mt-0.5">{event.location}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] text-[#94A3B8]">{event.time}</span>
                            <span className="text-[10px] text-[#CBD5E1]">·</span>
                            <span className="text-[10px] text-[#94A3B8]">{event.author}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </SectionCard>

              {/* Add Event */}
              <SectionCard title="Add Timeline Event" icon={Plus} iconColor="text-blue-500">
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#334155] mb-1.5">Event Label</label>
                    <input
                      type="text"
                      placeholder="e.g. Arrived at JFK customs"
                      value={newEventLabel}
                      onChange={(e) => setNewEventLabel(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] text-sm bg-[#F8FAFC] focus:outline-none focus:border-[#FFB800] placeholder:text-[#CBD5E1]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#334155] mb-1.5">Location</label>
                    <input
                      type="text"
                      placeholder="e.g. JFK-HUB-01, New York"
                      value={newEventLocation}
                      onChange={(e) => setNewEventLocation(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] text-sm bg-[#F8FAFC] focus:outline-none focus:border-[#FFB800] placeholder:text-[#CBD5E1]"
                    />
                  </div>
                  <button className="
                    flex items-center justify-center gap-2 w-full py-2.5 rounded-xl
                    bg-[#FFB800] text-[#0F172A] text-sm font-bold
                    hover:bg-[#F0AE00] active:scale-[0.98] transition-all
                  ">
                    <Plus size={14} />
                    Add Event
                  </button>
                </div>
              </SectionCard>
            </div>

            {/* Right column — Customs + Facility + Exceptions + Audit */}
            <div className="space-y-6">

              {/* Customs Panel */}
              <SectionCard title="Customs Panel" icon={Shield} iconColor="text-amber-500">
                <InfoRow label="HS Code"     value={SHIPMENT.hs_code} />
                <InfoRow label="Commodity"   value={SHIPMENT.commodity} />
                <InfoRow label="Declared"    value={SHIPMENT.declared_value} />
                <InfoRow label="Origin"      value={SHIPMENT.origin.country} />
                <div className="mt-3 space-y-2">
                  {["Commercial Invoice", "Packing List"].map((doc) => (
                    <div key={doc} className="flex items-center justify-between px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
                      <span className="text-xs text-[#334155]">{doc}</span>
                      <span className="text-[10px] text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 size={9} /> Verified
                      </span>
                    </div>
                  ))}
                </div>
              </SectionCard>

              {/* Facility Routing */}
              <SectionCard title="Facility Routing" icon={Warehouse} iconColor="text-purple-500">
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#334155] mb-1.5">Assigned Facility</label>
                    <div className="relative">
                      <select
                        value={facility}
                        onChange={(e) => setFacility(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] text-sm font-semibold text-[#0F172A] bg-[#F8FAFC] focus:outline-none focus:border-[#FFB800] appearance-none"
                      >
                        {["LHR-HUB-01", "JFK-HUB-01", "DXB-HUB-01", "SIN-HUB-01", "LOS-HUB-01"].map((f) => (
                          <option key={f}>{f}</option>
                        ))}
                      </select>
                      <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none" />
                    </div>
                  </div>
                  <button className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-[#E2E8F0] text-sm font-semibold text-[#64748B] hover:bg-[#F8FAFC] transition-colors">
                    <RotateCcw size={13} />
                    Reassign Facility
                  </button>
                </div>
              </SectionCard>

              {/* Exception Management */}
              <SectionCard title="Exception Management" icon={AlertTriangle} iconColor="text-red-500">
                <div className="p-3 bg-green-50 border border-green-100 rounded-xl flex items-center gap-2 mb-4">
                  <CheckCircle2 size={13} className="text-green-600 flex-shrink-0" />
                  <p className="text-xs text-green-700 font-medium">No active exceptions</p>
                </div>
                <button className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-red-200 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors">
                  <Flag size={13} />
                  Flag as Exception
                </button>
              </SectionCard>

              {/* Audit Trail */}
              <SectionCard title="Audit Trail" icon={FileText} iconColor="text-slate-400">
                <div className="space-y-3">
                  {AUDIT.map((entry) => (
                    <div key={entry.id} className="flex gap-2.5 text-xs">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#E2E8F0] flex-shrink-0 mt-1.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[#334155] font-medium leading-snug">{entry.action}</p>
                        <p className="text-[#94A3B8] mt-0.5">{entry.user} · {entry.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}