"use client";

import { useState, useMemo } from "react";
import Sidebar from "@/components/nav/Sidebar";
import Topbar from "@/app/dashboard/components/Navbar";
import {
  TrendingUp,
  TrendingDown,
  Package,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Globe,
  BarChart3,
  ArrowUpRight,
  Calendar,
} from "lucide-react";

// ─── Mock data ─────────────────────────────────────────────────────────────────
const WEEKLY_VOLUME = [
  { day: "Mon", value: 28 },
  { day: "Tue", value: 45 },
  { day: "Wed", value: 38 },
  { day: "Thu", value: 62 },
  { day: "Fri", value: 50 },
  { day: "Sat", value: 78 },
  { day: "Sun", value: 65 },
];

const MONTHLY_VOLUME = [
  { day: "Jan", value: 320 },
  { day: "Feb", value: 410 },
  { day: "Mar", value: 380 },
  { day: "Apr", value: 520 },
  { day: "May", value: 490 },
  { day: "Jun", value: 610 },
  { day: "Jul", value: 580 },
  { day: "Aug", value: 720 },
  { day: "Sep", value: 670 },
  { day: "Oct", value: 810 },
  { day: "Nov", value: 760 },
  { day: "Dec", value: 940 },
];

const STATUS_BREAKDOWN = [
  { label: "Delivered",        value: 58, color: "#22C55E", bg: "bg-green-500" },
  { label: "In Transit",       value: 24, color: "#3B82F6", bg: "bg-blue-500" },
  { label: "Out for Delivery", value: 10, color: "#A855F7", bg: "bg-purple-500" },
  { label: "Exceptions",       value: 5,  color: "#EF4444", bg: "bg-red-500" },
  { label: "Customs Hold",     value: 3,  color: "#F59E0B", bg: "bg-amber-500" },
];

const TOP_ROUTES = [
  { origin: "Lagos",    destination: "London",    count: 284, growth: "+12%" },
  { origin: "Lagos",    destination: "New York",  count: 196, growth: "+8%"  },
  { origin: "Dubai",    destination: "Singapore", count: 153, growth: "+21%" },
  { origin: "London",   destination: "Frankfurt", count: 138, growth: "+5%"  },
  { origin: "New York", destination: "Toronto",   count: 122, growth: "-3%"  },
];

const KPI_CARDS = [
  { label: "Total Shipments",  value: "1,284",  delta: "+14.2%", up: true,  icon: Package,        color: "bg-blue-50 text-blue-600" },
  { label: "Avg Delivery Time", value: "4.2d",  delta: "-0.3d",  up: true,  icon: Clock,          color: "bg-amber-50 text-amber-600" },
  { label: "On-Time Rate",     value: "99.3%",  delta: "+0.2%",  up: true,  icon: CheckCircle2,   color: "bg-green-50 text-green-600" },
  { label: "Active Exceptions", value: "5",     delta: "-2",     up: true,  icon: AlertTriangle,  color: "bg-red-50 text-red-600" },
];

// ─── Bar chart component ──────────────────────────────────────────────────────
function BarChart({ data, height = 120 }) {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div className="flex items-end gap-1.5" style={{ height }}>
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
          <div
            className="w-full rounded-t-md bg-[#FFB800] opacity-80 hover:opacity-100 transition-opacity cursor-default"
            style={{ height: `${(d.value / max) * (height - 20)}px` }}
            title={`${d.day}: ${d.value}`}
          />
          <span className="text-[10px] text-[#94A3B8] font-medium">{d.day}</span>
        </div>
      ))}
    </div>
  );
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────
function KPICard({ label, value, delta, up, icon: Icon, color }) {
  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
          <Icon size={16} />
        </div>
        <span className={`text-[11px] font-semibold flex items-center gap-0.5 ${up ? "text-green-600" : "text-red-500"}`}>
          {up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
          {delta}
        </span>
      </div>
      <p className="text-[11px] text-[#94A3B8] font-semibold uppercase tracking-wide">{label}</p>
      <p className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] mt-1 tracking-tight">{value}</p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AnalyticsPage() {
  const [period, setPeriod] = useState("week");
  const chartData = period === "week" ? WEEKLY_VOLUME : MONTHLY_VOLUME;

  const totalVolume = useMemo(
    () => chartData.reduce((s, d) => s + d.value, 0).toLocaleString(),
    [chartData]
  );

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar title="Analytics" subtitle="Shipment performance and trends" />

        <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-6">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-[#0F172A]">Your Shipment Analytics</h2>
              <p className="text-sm text-[#64748B] mt-0.5">Performance overview for your account</p>
            </div>
            <div className="flex items-center gap-1 bg-white border border-[#E2E8F0] rounded-xl p-1">
              {["week", "month"].map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all capitalize ${
                    period === p
                      ? "bg-[#FFB800] text-[#0F172A] shadow-sm"
                      : "text-[#64748B] hover:text-[#0F172A]"
                  }`}
                >
                  {p === "week" ? "This Week" : "This Year"}
                </button>
              ))}
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            {KPI_CARDS.map((card) => (
              <KPICard key={card.label} {...card} />
            ))}
          </div>

          {/* Main grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

            {/* Volume Chart */}
            <div className="xl:col-span-2 bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-sm font-bold text-[#0F172A]">Shipment Volume</h3>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    {period === "week" ? "Last 7 days" : "Last 12 months"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-extrabold text-[#0F172A]">{totalVolume}</p>
                  <p className="text-xs text-green-600 font-semibold flex items-center justify-end gap-0.5">
                    <TrendingUp size={10} /> +14.2% vs prior period
                  </p>
                </div>
              </div>
              <BarChart data={chartData} height={140} />
            </div>

            {/* Status Breakdown */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6">
              <h3 className="text-sm font-bold text-[#0F172A] mb-5">Status Breakdown</h3>
              <div className="space-y-3">
                {STATUS_BREAKDOWN.map((item) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className={`w-2.5 h-2.5 rounded-full ${item.bg}`} />
                        <span className="font-medium text-[#334155]">{item.label}</span>
                      </div>
                      <span className="font-bold text-[#0F172A]">{item.value}%</span>
                    </div>
                    <div className="h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${item.bg}`}
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Legend total */}
              <div className="mt-5 pt-4 border-t border-[#F1F5F9]">
                <p className="text-xs text-[#94A3B8]">Based on current period volume</p>
              </div>
            </div>
          </div>

          {/* Top Routes */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-[#F1F5F9] flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                <Globe size={14} className="text-blue-500" />
                Top Routes
              </h3>
              <span className="text-xs text-[#94A3B8]">By shipment count</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[480px]">
                <thead className="bg-[#F8FAFC]">
                  <tr>
                    {["Route", "Shipments", "Growth"].map((h) => (
                      <th key={h} className="px-6 py-3 text-left text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F8FAFC]">
                  {TOP_ROUTES.map((route, i) => (
                    <tr key={i} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="px-6 py-3.5">
                        <span className="text-sm font-medium text-[#0F172A]">
                          {route.origin} → {route.destination}
                        </span>
                      </td>
                      <td className="px-6 py-3.5">
                        <span className="text-sm text-[#334155]">{route.count}</span>
                      </td>
                      <td className="px-6 py-3.5">
                        <span className={`inline-flex items-center gap-0.5 text-xs font-semibold ${
                          route.growth.startsWith("+") ? "text-green-600" : "text-red-500"
                        }`}>
                          {route.growth.startsWith("+") ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                          {route.growth}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}