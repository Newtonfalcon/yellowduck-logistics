"use client";

import Sidebar from "@/components/nav/Sidebar";
import Topbar from "@/app/dashboard/components/Navbar";
import {
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  MapPin,
  Truck,
  Cloud,
  Navigation,
  MessageCircle,
  Zap,
  Filter,
  Search,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";

// ─── Mock Data ─────────────────────────────────────────────────────────────────
const EXCEPTION_SUMMARY = [
  { label: "Open Exceptions",    value: "15",  icon: AlertTriangle, color: "bg-red-50 text-red-600",      trend: "+2" },
  { label: "SLA at Risk",        value: "8",   icon: Clock,         color: "bg-orange-50 text-orange-600", trend: "+1" },
  { label: "Resolved Today",     value: "24",  icon: CheckCircle2,  color: "bg-green-50 text-green-600",  trend: "+6" },
  { label: "Escalated Issues",   value: "3",   icon: Zap,           color: "bg-amber-50 text-amber-600",  trend: "-1" },
];

const EXCEPTION_CATEGORIES = [
  { name: "CUSTOMS_HOLD", count: 5, severity: "high", icon: AlertTriangle },
  { name: "WEATHER_DELAY", count: 4, severity: "medium", icon: Cloud },
  { name: "MISROUTED", count: 3, severity: "high", icon: Navigation },
  { name: "ADDRESS_ISSUE", count: 2, severity: "medium", icon: MapPin },
  { name: "DAMAGED", count: 1, severity: "high", icon: XCircle },
];

const OPEN_EXCEPTIONS = [
  {
    id: "EXC-000101",
    shipment_id: "YDK-INTL-000101",
    category: "CUSTOMS_HOLD",
    severity: "high",
    title: "HS Code classification mismatch",
    description: "Electronics shipment flagged for incorrect commodity code classification. Requires shipper correction.",
    reported: "2026-05-23 14:22",
    sla_deadline: "2026-05-24 14:22",
    sla_hours_remaining: 22,
    status: "ESCALATED",
    assigned_to: "customs_team@yellowduck.io",
    facility: "PVG-HUB-02",
    impact: "Shipment held in Shanghai",
  },
  {
    id: "EXC-000102",
    shipment_id: "YDK-INTL-000084",
    category: "MISROUTED",
    severity: "high",
    title: "Package misrouted at JFK hub",
    description: "Inbound package sorted to wrong outbound gate. Currently rerouting to correct destination.",
    reported: "2026-05-23 11:45",
    sla_deadline: "2026-05-24 11:45",
    sla_hours_remaining: 19,
    status: "IN_PROGRESS",
    assigned_to: "jfk_ops@yellowduck.io",
    facility: "JFK-HUB-01",
    impact: "24h delay expected",
  },
  {
    id: "EXC-000103",
    shipment_id: "YDK-INTL-000098",
    category: "WEATHER_DELAY",
    severity: "medium",
    title: "Flight delay due to harmattan winds",
    description: "Lagos to Dubai route delayed by Saharan dust conditions. Alternative routing being evaluated.",
    reported: "2026-05-23 09:30",
    sla_deadline: "2026-05-24 09:30",
    sla_hours_remaining: 16,
    status: "IN_PROGRESS",
    assigned_to: "flight_ops@yellowduck.io",
    facility: "LOS-HUB-01",
    impact: "12-18h delay",
  },
  {
    id: "EXC-000104",
    shipment_id: "YDK-INTL-000072",
    category: "ADDRESS_ISSUE",
    severity: "medium",
    title: "Recipient address incomplete",
    description: "Missing apartment/suite number. Unable to deliver. Awaiting customer confirmation.",
    reported: "2026-05-22 16:20",
    sla_deadline: "2026-05-24 16:20",
    sla_hours_remaining: 41,
    status: "AWAITING_CUSTOMER",
    assigned_to: "cs_team@yellowduck.io",
    facility: "FRA-HUB-01",
    impact: "Delivery pending customer response",
  },
  {
    id: "EXC-000105",
    shipment_id: "YDK-INTL-000089",
    category: "DAMAGED",
    severity: "high",
    title: "Box corner crushed — contents damaged",
    description: "Damage detected during hub sorting. Contents partially compromised. Insurance claim initiated.",
    reported: "2026-05-23 08:15",
    sla_deadline: "2026-05-24 20:15",
    sla_hours_remaining: 37,
    status: "INSURANCE_CLAIM",
    assigned_to: "claims@yellowduck.io",
    facility: "LHR-HUB-01",
    impact: "Claim value: $2,100",
  },
];

const RESOLVED_EXCEPTIONS = [
  { id: "EXC-000080", shipment_id: "YDK-INTL-000055", category: "CUSTOMS_HOLD", severity: "medium", title: "Import license obtained", resolved: "2026-05-23 18:30", resolution_time: "26h", assigned_to: "customs_team@yellowduck.io" },
  { id: "EXC-000081", shipment_id: "YDK-INTL-000062", category: "ADDRESS_ISSUE", severity: "low", title: "Address corrected by customer", resolved: "2026-05-23 17:45", resolution_time: "4h", assigned_to: "cs_team@yellowduck.io" },
  { id: "EXC-000082", shipment_id: "YDK-INTL-000070", category: "WEATHER_DELAY", severity: "medium", title: "Flight rerouted successfully", resolved: "2026-05-23 14:10", resolution_time: "8h", assigned_to: "flight_ops@yellowduck.io" },
  { id: "EXC-000083", shipment_id: "YDK-INTL-000066", category: "MISROUTED", severity: "high", title: "Package located and rerouted", resolved: "2026-05-23 10:30", resolution_time: "12h", assigned_to: "jfk_ops@yellowduck.io" },
];

const SEVERITY_COLORS = {
  high: "bg-red-50 text-red-700 border-red-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  low: "bg-blue-50 text-blue-700 border-blue-200",
};

const STATUS_COLORS = {
  ESCALATED: "bg-red-100 text-red-800",
  IN_PROGRESS: "bg-blue-100 text-blue-800",
  AWAITING_CUSTOMER: "bg-amber-100 text-amber-800",
  INSURANCE_CLAIM: "bg-purple-100 text-purple-800",
  RESOLVED: "bg-green-100 text-green-800",
};

const CATEGORY_ICONS = {
  CUSTOMS_HOLD: <AlertTriangle size={16} />,
  WEATHER_DELAY: <Cloud size={16} />,
  MISROUTED: <Navigation size={16} />,
  ADDRESS_ISSUE: <MapPin size={16} />,
  DAMAGED: <XCircle size={16} />,
};

// ─── SLA Indicator ────────────────────────────────────────────────────────────
function SLAIndicator({ hours_remaining }) {
  const percentage = Math.max(0, (hours_remaining / 48) * 100);
  const color = hours_remaining > 24 ? "green" : hours_remaining > 12 ? "amber" : "red";
  const colorMap = {
    green: "bg-green-400",
    amber: "bg-amber-400",
    red: "bg-red-400",
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-[#E2E8F0] rounded-full h-2 overflow-hidden max-w-xs">
        <div className={`h-full rounded-full ${colorMap[color]} transition-all`} style={{ width: `${percentage}%` }} />
      </div>
      <span className="text-xs font-semibold text-[#0F172A] w-12">{hours_remaining}h</span>
    </div>
  );
}

// ─── Exception Card ───────────────────────────────────────────────────────────
function ExceptionCard({ exception }) {
  return (
    <div className="bg-white rounded-lg border border-[#E2E8F0] p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3 flex-1">
          <div className="mt-1">{CATEGORY_ICONS[exception.category]}</div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <p className="font-semibold text-[#0F172A]">{exception.title}</p>
              <span className={`px-2 py-1 rounded-full text-xs font-bold border ${SEVERITY_COLORS[exception.severity]}`}>
                {exception.severity.toUpperCase()}
              </span>
            </div>
            <p className="text-sm text-[#64748B]">{exception.shipment_id}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${STATUS_COLORS[exception.status]}`}>
          {exception.status.replace(/_/g, " ")}
        </span>
      </div>

      <p className="text-sm text-[#334155] mb-4">{exception.description}</p>

      <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-[#E2E8F0]">
        <div>
          <p className="text-xs text-[#94A3B8] uppercase tracking-wide">SLA Deadline</p>
          <p className="text-sm font-medium text-[#0F172A] mt-1">{exception.sla_deadline}</p>
        </div>
        <div>
          <p className="text-xs text-[#94A3B8] uppercase tracking-wide">Facility</p>
          <p className="text-sm font-medium text-[#0F172A] mt-1">{exception.facility}</p>
        </div>
        <div className="col-span-2">
          <p className="text-xs text-[#94A3B8] uppercase tracking-wide mb-2">SLA Status</p>
          <SLAIndicator hours_remaining={exception.sla_hours_remaining} />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-[#64748B]">
          <span className="font-medium text-[#0F172A]">Impact:</span> {exception.impact}
        </p>
        <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-[#0F172A] bg-[#F1F5F9] hover:bg-[#E2E8F0] rounded-lg transition-colors">
          <MessageCircle size={16} />
          Update
        </button>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ExceptionsPage() {
  const [activeTab, setActiveTab] = useState("open");

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      <Sidebar isAdmin />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />

        <div className="flex-1 overflow-auto">
          <div className="p-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-[#0F172A]">Exceptions & Escalations</h1>
              <p className="text-[#64748B] mt-1">Operational failures • Issue escalation • SLA monitoring</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {EXCEPTION_SUMMARY.map((card, idx) => (
                <div key={idx} className="bg-white rounded-lg border border-[#E2E8F0] p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-[#64748B] font-medium">{card.label}</p>
                      <p className="text-3xl font-bold text-[#0F172A] mt-2">{card.value}</p>
                      {card.trend && (
                        <p className={`text-xs mt-1 ${card.trend.startsWith("+") ? "text-red-600" : "text-green-600"}`}>
                          {card.trend}
                        </p>
                      )}
                    </div>
                    <div className={`${card.color} p-3 rounded-lg`}>
                      <card.icon size={20} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Exception Categories */}
            <div className="grid grid-cols-5 gap-4 mb-8">
              {EXCEPTION_CATEGORIES.map((category, idx) => {
                const severityColor =
                  category.severity === "high"
                    ? "bg-red-50 text-red-600"
                    : "bg-amber-50 text-amber-600";

                return (
                  <div key={idx} className="bg-white rounded-lg border border-[#E2E8F0] p-4 text-center">
                    <div className={`${severityColor} p-3 rounded-lg inline-block mb-3`}>
                      <category.icon size={20} />
                    </div>
                    <p className="text-2xl font-bold text-[#0F172A] mb-1">{category.count}</p>
                    <p className="text-xs font-medium text-[#64748B] uppercase tracking-wide">{category.name.replace(/_/g, " ")}</p>
                  </div>
                );
              })}
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-[#E2E8F0] mb-6">
              {[
                { id: "open", label: "Open Exceptions", count: OPEN_EXCEPTIONS.length },
                { id: "resolved", label: "Resolved Today", count: RESOLVED_EXCEPTIONS.length },
              ].map(({ id, label, count }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-2 px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                    activeTab === id
                      ? "text-[#0F172A] border-[#FFB800]"
                      : "text-[#64748B] border-transparent hover:text-[#0F172A]"
                  }`}
                >
                  {label}
                  <span className="bg-[#F1F5F9] px-2 py-0.5 rounded text-xs font-bold text-[#0F172A]">{count}</span>
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === "open" && (
              <div className="space-y-4">
                <div className="flex gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                    <input
                      type="text"
                      placeholder="Search by exception ID or shipment ID..."
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#E2E8F0] text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#FFB800]"
                    />
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E2E8F0] rounded-lg text-sm font-medium text-[#334155] hover:bg-[#F8FAFC]">
                    <Filter size={16} />
                    Filter
                  </button>
                </div>
                <div className="space-y-4">
                  {OPEN_EXCEPTIONS.map((exception) => (
                    <ExceptionCard key={exception.id} exception={exception} />
                  ))}
                </div>
              </div>
            )}

            {activeTab === "resolved" && (
              <div className="bg-white rounded-lg border border-[#E2E8F0] overflow-hidden">
                <table className="w-full">
                  <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                    <tr className="text-xs uppercase text-[#64748B] font-semibold">
                      <th className="px-6 py-4 text-left">Exception ID</th>
                      <th className="px-6 py-4 text-left">Shipment</th>
                      <th className="px-6 py-4 text-left">Category</th>
                      <th className="px-6 py-4 text-left">Title</th>
                      <th className="px-6 py-4 text-left">Resolution Time</th>
                      <th className="px-6 py-4 text-left">Resolved</th>
                    </tr>
                  </thead>
                  <tbody>
                    {RESOLVED_EXCEPTIONS.map((exception) => (
                      <tr key={exception.id} className="border-b border-[#E2E8F0] hover:bg-[#F8FAFC]">
                        <td className="px-6 py-4 font-mono text-sm text-[#0F172A]">{exception.id}</td>
                        <td className="px-6 py-4 font-mono text-sm text-[#0F172A]">{exception.shipment_id}</td>
                        <td className="px-6 py-4 text-sm text-[#64748B]">{exception.category.replace(/_/g, " ")}</td>
                        <td className="px-6 py-4 text-sm text-[#334155]">{exception.title}</td>
                        <td className="px-6 py-4 text-sm font-medium text-green-600">{exception.resolution_time}</td>
                        <td className="px-6 py-4 text-sm text-[#64748B]">{exception.resolved}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
