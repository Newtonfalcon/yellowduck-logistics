"use client";

import Sidebar from "@/components/nav/Sidebar";
import Topbar from "@/app/dashboard/components/Navbar";
import {
  Warehouse,
  Globe,
  Plane,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  MapPin,
  Clock,
  BarChart3,
  Plus,
  Search,
  ChevronRight,
  Filter,
} from "lucide-react";

// ─── Mock Data ─────────────────────────────────────────────────────────────────
const SUMMARY = [
  { label: "Total Facilities",   value: "44",    icon: Warehouse,     color: "bg-purple-50 text-purple-600" },
  { label: "Online",             value: "42",    icon: CheckCircle2,  color: "bg-green-50 text-green-600" },
  { label: "Degraded",           value: "1",     icon: AlertTriangle, color: "bg-amber-50 text-amber-600" },
  { label: "Offline",            value: "1",     icon: XCircle,       color: "bg-red-50 text-red-600" },
];

const FACILITIES = [
  {
    code: "LHR-HUB-01",
    name: "London Heathrow Hub",
    country: "United Kingdom",
    flag: "🇬🇧",
    timezone: "Europe/London",
    type: "AIR_HUB",
    status: "ONLINE",
    throughput: 94,
    inbound: 421,
    outbound: 388,
    capacity: 650,
    managed_by: "Ops Team EU",
    last_updated: "2 min ago",
  },
  {
    code: "JFK-HUB-01",
    name: "New York JFK Hub",
    country: "United States",
    flag: "🇺🇸",
    timezone: "America/New_York",
    type: "AIR_HUB",
    status: "ONLINE",
    throughput: 78,
    inbound: 315,
    outbound: 301,
    capacity: 600,
    managed_by: "Ops Team NA",
    last_updated: "1 min ago",
  },
  {
    code: "DXB-HUB-01",
    name: "Dubai International Hub",
    country: "United Arab Emirates",
    flag: "🇦🇪",
    timezone: "Asia/Dubai",
    type: "AIR_HUB",
    status: "ONLINE",
    throughput: 88,
    inbound: 289,
    outbound: 274,
    capacity: 500,
    managed_by: "Ops Team MENA",
    last_updated: "5 min ago",
  },
  {
    code: "PVG-HUB-02",
    name: "Shanghai Pudong Hub",
    country: "China",
    flag: "🇨🇳",
    timezone: "Asia/Shanghai",
    type: "AIR_HUB",
    status: "DEGRADED",
    throughput: 61,
    inbound: 180,
    outbound: 112,
    capacity: 480,
    managed_by: "Ops Team APAC",
    last_updated: "3 min ago",
    alert: "Processing delays — customs backlog",
  },
  {
    code: "SIN-HUB-01",
    name: "Singapore Changi Hub",
    country: "Singapore",
    flag: "🇸🇬",
    timezone: "Asia/Singapore",
    type: "AIR_HUB",
    status: "ONLINE",
    throughput: 82,
    inbound: 210,
    outbound: 198,
    capacity: 400,
    managed_by: "Ops Team APAC",
    last_updated: "8 min ago",
  },
  {
    code: "LOS-HUB-01",
    name: "Lagos MMA Hub",
    country: "Nigeria",
    flag: "🇳🇬",
    timezone: "Africa/Lagos",
    type: "GROUND_HUB",
    status: "OFFLINE",
    throughput: 0,
    inbound: 0,
    outbound: 0,
    capacity: 200,
    managed_by: "Ops Team Africa",
    last_updated: "47 min ago",
    alert: "Scheduled maintenance — back online 18:00 UTC",
  },
  {
    code: "YYZ-HUB-01",
    name: "Toronto Pearson Hub",
    country: "Canada",
    flag: "🇨🇦",
    timezone: "America/Toronto",
    type: "AIR_HUB",
    status: "ONLINE",
    throughput: 71,
    inbound: 178,
    outbound: 165,
    capacity: 350,
    managed_by: "Ops Team NA",
    last_updated: "4 min ago",
  },
  {
    code: "FRA-HUB-01",
    name: "Frankfurt Airport Hub",
    country: "Germany",
    flag: "🇩🇪",
    timezone: "Europe/Berlin",
    type: "AIR_HUB",
    status: "ONLINE",
    throughput: 76,
    inbound: 193,
    outbound: 184,
    capacity: 420,
    managed_by: "Ops Team EU",
    last_updated: "6 min ago",
  },
];

const TYPE_LABELS = {
  AIR_HUB:    { label: "Air Hub",    color: "bg-blue-50 text-blue-700" },
  GROUND_HUB: { label: "Ground Hub", color: "bg-slate-50 text-slate-700" },
  SEA_PORT:   { label: "Sea Port",   color: "bg-teal-50 text-teal-700" },
};

const STATUS_CONFIG = {
  ONLINE:   { color: "bg-green-400",  textColor: "text-green-700",  bg: "bg-green-50",  label: "Online" },
  DEGRADED: { color: "bg-amber-400",  textColor: "text-amber-700",  bg: "bg-amber-50",  label: "Degraded" },
  OFFLINE:  { color: "bg-red-400",    textColor: "text-red-700",    bg: "bg-red-50",    label: "Offline" },
};

function ThroughputBar({ pct, status }) {
  const color = status === "OFFLINE" ? "bg-red-400" : status === "DEGRADED" ? "bg-amber-400" : pct > 85 ? "bg-amber-400" : "bg-[#FFB800]";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-bold text-[#0F172A] w-7 text-right">{pct}%</span>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function FacilitiesPage() {
  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      <Sidebar isAdmin />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar title="Facilities" subtitle="Global hub network management" />

        <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-6">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-[#0F172A]">Global Facility Network</h2>
              <p className="text-sm text-[#64748B] mt-0.5">44 facilities across 31 countries · Updated live</p>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#E2E8F0] text-sm font-semibold text-[#64748B] bg-white hover:bg-[#F8FAFC] transition-colors">
                <Filter size={13} />
                Filter
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FFB800] text-[#0F172A] text-sm font-bold hover:bg-[#F0AE00] transition-colors">
                <Plus size={14} />
                Add Facility
              </button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {SUMMARY.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-sm">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
                    <Icon size={17} />
                  </div>
                  <p className="text-3xl font-extrabold text-[#0F172A]">{s.value}</p>
                  <p className="text-xs text-[#94A3B8] font-medium mt-0.5">{s.label}</p>
                </div>
              );
            })}
          </div>

          {/* Search bar */}
          <div className="relative max-w-md">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <input
              type="text"
              placeholder="Search by code, city, or country…"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#E2E8F0] text-sm bg-white focus:outline-none focus:border-[#FFB800] placeholder:text-[#CBD5E1]"
            />
          </div>

          {/* Facilities Table */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[700px]">
                <thead>
                  <tr className="border-b border-[#F1F5F9] bg-[#F8FAFC]">
                    {["Facility", "Type", "Status", "Throughput", "Traffic", "Managed By", "Updated", ""].map((h) => (
                      <th key={h} className="px-5 py-3.5 text-left text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F8FAFC]">
                  {FACILITIES.map((fac) => {
                    const sc = STATUS_CONFIG[fac.status];
                    const tc = TYPE_LABELS[fac.type] ?? TYPE_LABELS["AIR_HUB"];
                    return (
                      <>
                        <tr key={fac.code} className="hover:bg-[#F8FAFC] transition-colors group">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <span className="text-xl">{fac.flag}</span>
                              <div>
                                <p className="font-bold text-[#0F172A] font-mono text-xs">{fac.code}</p>
                                <p className="text-xs text-[#64748B] mt-0.5">{fac.name}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${tc.color}`}>
                              {tc.label}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-1.5">
                              <span className={`w-2 h-2 rounded-full ${sc.color}`} />
                              <span className={`text-xs font-semibold ${sc.textColor}`}>{sc.label}</span>
                            </div>
                          </td>
                          <td className="px-5 py-4 w-36">
                            <ThroughputBar pct={fac.throughput} status={fac.status} />
                          </td>
                          <td className="px-5 py-4">
                            <div className="text-xs text-[#64748B] whitespace-nowrap">
                              <span className="text-[#0F172A] font-semibold">↓{fac.inbound}</span> · <span>↑{fac.outbound}</span>
                            </div>
                            <p className="text-[10px] text-[#94A3B8] mt-0.5">cap. {fac.capacity}/day</p>
                          </td>
                          <td className="px-5 py-4 text-xs text-[#64748B] whitespace-nowrap">{fac.managed_by}</td>
                          <td className="px-5 py-4 text-xs text-[#94A3B8] whitespace-nowrap">{fac.last_updated}</td>
                          <td className="px-5 py-4">
                            <button className="text-xs text-[#64748B] hover:text-[#0F172A] flex items-center gap-1 transition-colors">
                              View <ChevronRight size={12} />
                            </button>
                          </td>
                        </tr>
                        {fac.alert && (
                          <tr key={`${fac.code}-alert`} className="bg-amber-50/60">
                            <td colSpan={8} className="px-5 py-2.5 border-t-0">
                              <div className="flex items-center gap-2 text-xs text-amber-700">
                                <AlertTriangle size={12} className="flex-shrink-0" />
                                <span className="font-medium">{fac.alert}</span>
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* World map placeholder */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-[#F1F5F9] flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                <Globe size={14} className="text-blue-500" />
                Network Coverage Map
              </h3>
              <span className="text-xs text-[#94A3B8] bg-[#F8FAFC] border border-[#E2E8F0] px-2 py-1 rounded-full">
                Interactive map · Coming soon
              </span>
            </div>
            <div
              className="h-48 flex items-center justify-center text-[#CBD5E1]"
              style={{
                background: "radial-gradient(circle at 50% 50%, rgba(255,184,0,0.04) 0%, transparent 60%), linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)",
                backgroundImage: `
                  radial-gradient(circle at 50% 50%, rgba(255,184,0,0.04) 0%, transparent 60%),
                  repeating-linear-gradient(0deg, transparent, transparent 30px, rgba(226,232,240,0.4) 30px, rgba(226,232,240,0.4) 31px),
                  repeating-linear-gradient(90deg, transparent, transparent 30px, rgba(226,232,240,0.4) 30px, rgba(226,232,240,0.4) 31px)
                `,
              }}
            >
              <div className="text-center">
                <Globe size={28} className="text-[#E2E8F0] mx-auto mb-2" />
                <p className="text-sm text-[#CBD5E1] font-medium">Global network visualization</p>
                <p className="text-xs text-[#CBD5E1] mt-1">44 facilities · 31 countries · 180+ markets</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
