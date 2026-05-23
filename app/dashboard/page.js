"use client";

import Sidebar from "@/components/nav/Sidebar";
import Topbar from "@/app/dashboard/components/Navbar";
import Link from "next/link";
import {
  Package,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Plane,
  Truck,
  Warehouse,
  Shield,
  Plus,
  BarChart3,
  MapPin,
  ChevronRight,
} from "lucide-react";

// ─── Mock Data ─────────────────────────────────────────────────────────────────
const METRICS = [
  {
    label: "Total Shipments",
    value: "182",
    delta: "+12%",
    up: true,
    icon: Package,
    color: "bg-blue-50 text-blue-600",
  },
  {
    label: "In Transit",
    value: "24",
    delta: "+3 today",
    up: true,
    icon: Plane,
    color: "bg-amber-50 text-amber-600",
  },
  {
    label: "Delivered (30d)",
    value: "153",
    delta: "99.3% on-time",
    up: true,
    icon: CheckCircle2,
    color: "bg-green-50 text-green-600",
  },
  {
    label: "Exceptions",
    value: "5",
    delta: "-2 vs last wk",
    up: true,
    icon: AlertTriangle,
    color: "bg-red-50 text-red-600",
  },
];

const RECENT_SHIPMENTS = [
  {
    id: "YDK-INTL-000182",
    route: "Lagos → New York",
    status: "IN_TRANSIT",
    eta: "Jun 2",
    weight: "3.4 kg",
    service: "Express",
  },
  {
    id: "YDK-INTL-000181",
    route: "London → Dubai",
    status: "CUSTOMS_HOLD",
    eta: "Jun 1",
    weight: "1.2 kg",
    service: "Standard",
  },
  {
    id: "YDK-INTL-000180",
    route: "Toronto → Lagos",
    status: "DELIVERED",
    eta: "May 28",
    weight: "6.0 kg",
    service: "Economy",
  },
  {
    id: "YDK-INTL-000179",
    route: "New York → London",
    status: "OUT_FOR_DELIVERY",
    eta: "May 23",
    weight: "2.1 kg",
    service: "Express",
  },
  {
    id: "YDK-INTL-000178",
    route: "Dubai → Singapore",
    status: "DELIVERED",
    eta: "May 22",
    weight: "0.8 kg",
    service: "Express",
  },
];

const ACTIVITY = [
  { id: 1, msg: "YDK-INTL-000182 departed London Heathrow",  time: "2 min ago",  icon: Plane,        type: "info" },
  { id: 2, msg: "YDK-INTL-000181 placed on customs hold",    time: "1 hr ago",   icon: AlertTriangle, type: "warn" },
  { id: 3, msg: "YDK-INTL-000180 delivered successfully",    time: "3 hr ago",   icon: CheckCircle2, type: "success" },
  { id: 4, msg: "Invoice INV-2026-44 issued · $284.00",      time: "5 hr ago",   icon: BarChart3,    type: "neutral" },
  { id: 5, msg: "YDK-INTL-000179 out for delivery",          time: "Yesterday",  icon: Truck,        type: "info" },
  { id: 6, msg: "YDK-INTL-000178 delivered successfully",    time: "May 22",     icon: CheckCircle2, type: "success" },
];

const QUICK_ACTIONS = [
  { label: "New Shipment",    href: "/dashboard/create",    icon: Plus,       accent: true },
  { label: "Track Package",   href: "/dashboard/tracking",  icon: MapPin,     accent: false },
  { label: "View Invoices",   href: "/dashboard/invoices",  icon: BarChart3,  accent: false },
  { label: "Customs Docs",    href: "/dashboard/shipments", icon: Shield,     accent: false },
];

// ─── Status Config ─────────────────────────────────────────────────────────────
const STATUS_STYLE = {
  IN_TRANSIT:       "bg-blue-50 text-blue-700",
  DELIVERED:        "bg-green-50 text-green-700",
  CUSTOMS_HOLD:     "bg-amber-50 text-amber-700",
  OUT_FOR_DELIVERY: "bg-purple-50 text-purple-700",
  EXCEPTION:        "bg-red-50 text-red-700",
};
const STATUS_LABEL = {
  IN_TRANSIT:       "In Transit",
  DELIVERED:        "Delivered",
  CUSTOMS_HOLD:     "Customs Hold",
  OUT_FOR_DELIVERY: "Out for Delivery",
  EXCEPTION:        "Exception",
};

const ACTIVITY_STYLE = {
  info:    "bg-blue-50 text-blue-500",
  warn:    "bg-amber-50 text-amber-500",
  success: "bg-green-50 text-green-600",
  neutral: "bg-slate-50 text-slate-400",
};

// ─── Mini Sparkline (pure CSS bars) ──────────────────────────────────────────
function Sparkline({ values = [40, 70, 55, 80, 65, 90, 75] }) {
  const max = Math.max(...values);
  return (
    <div className="flex items-end gap-0.5 h-10">
      {values.map((v, i) => (
        <div
          key={i}
          className="flex-1 bg-[#FFB800] rounded-sm opacity-80"
          style={{ height: `${(v / max) * 100}%` }}
        />
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar title="Dashboard" subtitle="Manage your global shipments" />

        <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-6">

          {/* ── Welcome + Quick Actions ──────────────────────────── */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-[#0F172A]">Good morning, Jane 👋</h2>
              <p className="text-sm text-[#64748B] mt-0.5">You have 24 active shipments across 11 countries.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {QUICK_ACTIONS.map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.href}
                    href={action.href}
                    className={`
                      inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold
                      transition-all active:scale-[0.98]
                      ${action.accent
                        ? "bg-[#FFB800] text-[#0F172A] hover:bg-[#F0AE00] shadow-sm"
                        : "bg-white text-[#334155] border border-[#E2E8F0] hover:bg-[#F8FAFC]"
                      }
                    `}
                  >
                    <Icon size={15} />
                    {action.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* ── Metrics Cards ────────────────────────────────────── */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            {METRICS.map((m) => {
              const Icon = m.icon;
              return (
                <div key={m.label} className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${m.color}`}>
                      <Icon size={17} />
                    </div>
                    <span
                      className={`text-xs font-semibold flex items-center gap-0.5 ${
                        m.up ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      {m.up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                      {m.delta}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#94A3B8] font-medium uppercase tracking-wide">{m.label}</p>
                  <p className="text-3xl font-extrabold text-[#0F172A] mt-1 tracking-tight">{m.value}</p>
                </div>
              );
            })}
          </div>

          {/* ── Main Content ─────────────────────────────────────── */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

            {/* Recent Shipments (2/3) */}
            <div className="xl:col-span-2 bg-white rounded-2xl border border-[#E2E8F0] shadow-sm">
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#F1F5F9]">
                <h3 className="text-sm font-bold text-[#0F172A]">Recent Shipments</h3>
                <Link
                  href="/dashboard/shipments"
                  className="text-xs text-[#64748B] hover:text-[#0F172A] flex items-center gap-1 font-medium transition-colors"
                >
                  View all <ArrowRight size={12} />
                </Link>
              </div>

              <div className="divide-y divide-[#F8FAFC]">
                {RECENT_SHIPMENTS.map((ship) => (
                  <Link
                    key={ship.id}
                    href={`/track/${ship.id}`}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-[#F8FAFC] transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center flex-shrink-0">
                      <Package size={15} className="text-[#94A3B8]" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#0F172A] truncate group-hover:text-[#FFB800] transition-colors">
                        {ship.id}
                      </p>
                      <p className="text-xs text-[#64748B] mt-0.5 flex items-center gap-1">
                        <MapPin size={9} />
                        {ship.route}
                      </p>
                    </div>

                    <div className="hidden sm:flex flex-col items-end gap-1">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLE[ship.status]}`}>
                        {STATUS_LABEL[ship.status]}
                      </span>
                      <span className="text-[10px] text-[#94A3B8]">ETA {ship.eta} · {ship.weight}</span>
                    </div>

                    <ChevronRight size={15} className="text-[#E2E8F0] group-hover:text-[#94A3B8] transition-colors flex-shrink-0" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-6">

              {/* Volume chart */}
              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-[#0F172A]">Shipment Volume</h3>
                  <span className="text-[10px] text-[#94A3B8] font-medium">Last 7 days</span>
                </div>
                <Sparkline values={[28, 45, 38, 62, 50, 78, 65]} />
                <div className="mt-3 flex justify-between text-[10px] text-[#94A3B8]">
                  <span>Mon</span><span>Tue</span><span>Wed</span>
                  <span>Thu</span><span>Fri</span><span>Sat</span><span>Today</span>
                </div>
                <div className="mt-4 pt-3 border-t border-[#F1F5F9] flex items-center gap-2">
                  <TrendingUp size={13} className="text-green-500" />
                  <span className="text-xs text-[#64748B]">
                    <strong className="text-[#0F172A]">+14.2%</strong> vs previous period
                  </span>
                </div>
              </div>

              {/* Activity Feed */}
              <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm">
                <div className="flex items-center justify-between px-5 py-4 border-b border-[#F1F5F9]">
                  <h3 className="text-sm font-bold text-[#0F172A]">Activity Feed</h3>
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                </div>
                <ul className="divide-y divide-[#F8FAFC]">
                  {ACTIVITY.map((item) => {
                    const Icon = item.icon;
                    return (
                      <li key={item.id} className="flex items-start gap-3 px-5 py-3.5">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${ACTIVITY_STYLE[item.type]}`}>
                          <Icon size={13} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-[#334155] leading-snug">{item.msg}</p>
                          <p className="text-[10px] text-[#94A3B8] mt-0.5">{item.time}</p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}