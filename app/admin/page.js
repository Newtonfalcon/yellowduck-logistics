"use client";

import Sidebar from "@/app/dashboard/components/Navbar";
import Topbar from "@/components/nav/Sidebar";
import Link from "next/link";
import {
  Package,
  Plane,
  AlertTriangle,
  Shield,
  Clock,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  Warehouse,
  Globe,
  Zap,
  MapPin,
  RefreshCw,
  XCircle,
} from "lucide-react";

// ─── Mock Data ─────────────────────────────────────────────────────────────────
const GLOBAL_METRICS = [
  { label: "Active Shipments",    value: "14,281", delta: "+241",  up: true,  icon: Package,   color: "bg-blue-50 text-blue-600" },
  { label: "In-Flight Right Now", value: "1,482",  delta: "+38",   up: true,  icon: Plane,     color: "bg-sky-50 text-sky-600" },
  { label: "Customs Holds",       value: "63",      delta: "+7",    up: false, icon: Shield,    color: "bg-amber-50 text-amber-600" },
  { label: "Delayed > 24h",       value: "28",      delta: "-4",    up: true,  icon: Clock,     color: "bg-orange-50 text-orange-600" },
  { label: "Exceptions Open",     value: "15",      delta: "-2",    up: true,  icon: AlertTriangle, color: "bg-red-50 text-red-600" },
  { label: "Delivered Today",     value: "2,104",   delta: "+18%",  up: true,  icon: CheckCircle2, color: "bg-green-50 text-green-600" },
  { label: "Facilities Online",   value: "42 / 44", delta: "2 down", up: false, icon: Warehouse, color: "bg-purple-50 text-purple-600" },
  { label: "Countries Active",    value: "87",      delta: "Steady", up: true,  icon: Globe,     color: "bg-teal-50 text-teal-600" },
];

const DELAYED = [
  { id: "YDK-INTL-000101", route: "Shanghai → London", delay: "31h", reason: "Customs hold — HS mismatch", facility: "PVG-HUB-02", severity: "high" },
  { id: "YDK-INTL-000098", route: "Lagos → Dubai",     delay: "27h", reason: "Weather delay — harmattan",  facility: "LOS-HUB-01", severity: "medium" },
  { id: "YDK-INTL-000084", route: "NYC → Singapore",   delay: "25h", reason: "Misrouted at JFK hub",       facility: "JFK-HUB-01", severity: "high" },
  { id: "YDK-INTL-000072", route: "Frankfurt → Cairo", delay: "24h", reason: "Address verification",       facility: "FRA-HUB-01", severity: "low" },
];

const CUSTOMS_HOLDS = [
  { id: "YDK-INTL-000101", country: "China", commodity: "Electronics", value: "$2,400", hold: "HS Code mismatch", since: "31h ago", flag: "🇨🇳" },
  { id: "YDK-INTL-000059", country: "Brazil", commodity: "Apparel",   value: "$890",   hold: "Import license",   since: "18h ago", flag: "🇧🇷" },
  { id: "YDK-INTL-000042", country: "India",  commodity: "Medical",    value: "$3,100", hold: "Prohibited item",  since: "9h ago",  flag: "🇮🇳" },
];

const FACILITY_THROUGHPUT = [
  { code: "LHR-HUB-01", name: "London Heathrow",   throughput: 94, active: true,  inbound: 421, outbound: 388 },
  { code: "JFK-HUB-01", name: "New York JFK",       throughput: 78, active: true,  inbound: 315, outbound: 301 },
  { code: "DXB-HUB-01", name: "Dubai International", throughput: 88, active: true,  inbound: 289, outbound: 274 },
  { code: "PVG-HUB-02", name: "Shanghai Pudong",    throughput: 61, active: true,  inbound: 180, outbound: 112 },
  { code: "SIN-HUB-01", name: "Singapore Changi",   throughput: 82, active: true,  inbound: 210, outbound: 198 },
  { code: "LOS-HUB-01", name: "Lagos MMA",           throughput: 45, active: false, inbound: 90,  outbound: 47  },
];

const LIVE_FEED = [
  { id: 1, msg: "YDK-INTL-000182 departed LHR — flight YD4421",  time: "0m",  type: "info" },
  { id: 2, msg: "EXCEPTION: YDK-INTL-000084 misrouted at JFK",   time: "3m",  type: "error" },
  { id: 3, msg: "Customs cleared: YDK-INTL-000175 Lagos export",  time: "7m",  type: "success" },
  { id: 4, msg: "YDK-INTL-000059 customs hold — Brazil import",   time: "12m", type: "warn" },
  { id: 5, msg: "Facility DXB-HUB-01 throughput above 85%",       time: "18m", type: "warn" },
  { id: 6, msg: "1,482 packages currently in air — peak traffic", time: "22m", type: "info" },
  { id: 7, msg: "YDK-INTL-000101 HS code update requested",       time: "25m", type: "warn" },
  { id: 8, msg: "2,104 packages delivered today — record pace",   time: "30m", type: "success" },
];

const FEED_STYLE = {
  info:    { bar: "bg-blue-400",  text: "text-blue-600",  bg: "bg-blue-50" },
  error:   { bar: "bg-red-400",   text: "text-red-600",   bg: "bg-red-50" },
  success: { bar: "bg-green-400", text: "text-green-600", bg: "bg-green-50" },
  warn:    { bar: "bg-amber-400", text: "text-amber-600", bg: "bg-amber-50" },
};

const SEVERITY_STYLE = {
  high:   "bg-red-50 text-red-700 border-red-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  low:    "bg-slate-50 text-slate-600 border-slate-200",
};

// ─── Throughput Bar ───────────────────────────────────────────────────────────
function ThroughputBar({ pct, active }) {
  const color = !active ? "bg-red-400" : pct > 85 ? "bg-amber-400" : pct > 60 ? "bg-[#FFB800]" : "bg-green-400";
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 bg-[#F1F5F9] rounded-full h-2 overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-bold text-[#0F172A] w-8 text-right">{pct}%</span>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AdminPage() {
  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      <Sidebar isAdmin />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar title="Operations Control Center" subtitle="Global logistics command — live" />

        <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-6">

          {/* ── Header ────────────────────────────────────────── */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-extrabold text-[#0F172A] flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                Live Operations
              </h2>
              <p className="text-sm text-[#64748B] mt-0.5">Saturday, May 23, 2026 · 14:37 UTC · All systems nominal</p>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#E2E8F0] text-sm font-semibold text-[#64748B] bg-white hover:bg-[#F8FAFC] transition-colors">
                <RefreshCw size={13} />
                Refresh
              </button>
              <Link
                href="/admin/exceptions"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition-colors"
              >
                <AlertTriangle size={13} />
                15 Exceptions
              </Link>
            </div>
          </div>

          {/* ── Global Metrics Grid ────────────────────────────── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {GLOBAL_METRICS.map((m) => {
              const Icon = m.icon;
              return (
                <div key={m.label} className="bg-white rounded-2xl border border-[#E2E8F0] p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${m.color}`}>
                      <Icon size={15} />
                    </div>
                    <span className={`text-[11px] font-bold flex items-center gap-0.5 ${m.up ? "text-green-600" : "text-red-500"}`}>
                      {m.up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                      {m.delta}
                    </span>
                  </div>
                  <p className="text-[10px] text-[#94A3B8] font-semibold uppercase tracking-wide">{m.label}</p>
                  <p className="text-2xl font-extrabold text-[#0F172A] mt-0.5 tracking-tight">{m.value}</p>
                </div>
              );
            })}
          </div>

          {/* ── Row 2: Delayed + Customs Holds ────────────────── */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

            {/* Delayed Shipments */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm">
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#F1F5F9]">
                <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                  <Clock size={14} className="text-orange-500" />
                  Delayed Shipments
                </h3>
                <Link href="/admin/shipments" className="text-xs text-[#64748B] hover:text-[#0F172A] flex items-center gap-1 transition-colors">
                  View all <ChevronRight size={11} />
                </Link>
              </div>
              <div className="divide-y divide-[#F8FAFC]">
                {DELAYED.map((ship) => (
                  <Link
                    key={ship.id}
                    href={`/admin/shipments/${ship.id}`}
                    className="flex items-start gap-4 px-5 py-4 hover:bg-[#F8FAFC] transition-colors group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-[#0F172A]">{ship.id}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full border font-semibold ${SEVERITY_STYLE[ship.severity]}`}>
                          {ship.severity.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-xs text-[#64748B] mt-0.5 flex items-center gap-1">
                        <MapPin size={9} /> {ship.route}
                      </p>
                      <p className="text-xs text-[#94A3B8] mt-0.5">{ship.reason}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="text-sm font-extrabold text-red-500">+{ship.delay}</span>
                      <p className="text-[10px] text-[#94A3B8] mt-0.5">{ship.facility}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Customs Holds */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm">
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#F1F5F9]">
                <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                  <Shield size={14} className="text-amber-500" />
                  Customs Holds
                </h3>
                <Link href="/admin/customs" className="text-xs text-[#64748B] hover:text-[#0F172A] flex items-center gap-1 transition-colors">
                  View all <ChevronRight size={11} />
                </Link>
              </div>
              <div className="divide-y divide-[#F8FAFC]">
                {CUSTOMS_HOLDS.map((hold) => (
                  <Link
                    key={hold.id}
                    href={`/admin/shipments/${hold.id}`}
                    className="flex items-center gap-4 px-5 py-4 hover:bg-[#F8FAFC] transition-colors"
                  >
                    <span className="text-xl flex-shrink-0">{hold.flag}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-[#0F172A]">{hold.id}</p>
                      <p className="text-xs text-[#64748B]">{hold.country} · {hold.commodity}</p>
                      <p className="text-xs text-amber-600 font-medium mt-0.5">{hold.hold}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold text-[#0F172A]">{hold.value}</p>
                      <p className="text-[10px] text-[#94A3B8] mt-0.5">{hold.since}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* ── Row 3: Facility Throughput + Live Feed ─────────── */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

            {/* Facility Throughput (2/3) */}
            <div className="xl:col-span-2 bg-white rounded-2xl border border-[#E2E8F0] shadow-sm">
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#F1F5F9]">
                <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                  <Warehouse size={14} className="text-purple-500" />
                  Facility Throughput
                </h3>
                <Link href="/admin/facilities" className="text-xs text-[#64748B] hover:text-[#0F172A] flex items-center gap-1 transition-colors">
                  Manage <ChevronRight size={11} />
                </Link>
              </div>
              <div className="p-5 space-y-4">
                {FACILITY_THROUGHPUT.map((fac) => (
                  <div key={fac.code} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${fac.active ? "bg-green-400" : "bg-red-400"}`} />
                        <span className="text-sm font-semibold text-[#0F172A]">{fac.name}</span>
                        <span className="text-[10px] text-[#94A3B8] font-mono">{fac.code}</span>
                      </div>
                      <div className="text-[11px] text-[#64748B] flex gap-3">
                        <span>↓ {fac.inbound}</span>
                        <span>↑ {fac.outbound}</span>
                      </div>
                    </div>
                    <ThroughputBar pct={fac.throughput} active={fac.active} />
                  </div>
                ))}
              </div>
            </div>

            {/* Live Activity Stream */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#F1F5F9]">
                <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                  <Zap size={14} className="text-[#FFB800]" />
                  Live Stream
                </h3>
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              </div>
              <div className="divide-y divide-[#F8FAFC] max-h-[320px] overflow-y-auto">
                {LIVE_FEED.map((item) => {
                  const s = FEED_STYLE[item.type];
                  return (
                    <div key={item.id} className="flex gap-3 px-5 py-3 items-start">
                      <div className={`w-1.5 flex-shrink-0 self-stretch rounded-full mt-1 ${s.bar}`} />
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs leading-snug ${s.text}`}>{item.msg}</p>
                        <p className="text-[10px] text-[#CBD5E1] mt-0.5">{item.time} ago</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}