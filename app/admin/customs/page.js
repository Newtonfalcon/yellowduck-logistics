"use client";

import Sidebar from "@/components/nav/Sidebar";
import Topbar from "@/app/dashboard/components/Navbar";
import {
  Shield,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  MapPin,
  Package,
  Download,
  Upload,
  Search,
  Filter,
  ChevronRight,
  Flag,
  DollarSign,
  Calendar,
} from "lucide-react";
import { useState } from "react";

// ─── Mock Data ─────────────────────────────────────────────────────────────────
const CUSTOMS_SUMMARY = [
  { label: "Active Holds",     value: "63",   icon: Shield,      color: "bg-amber-50 text-amber-600",  delta: "+7" },
  { label: "Pending Review",   value: "24",   icon: Clock,       color: "bg-blue-50 text-blue-600",   delta: "+3" },
  { label: "Cleared Today",    value: "142",  icon: CheckCircle2, color: "bg-green-50 text-green-600", delta: "+28" },
  { label: "Escalated",        value: "8",    icon: AlertTriangle, color: "bg-red-50 text-red-600",    delta: "-2" },
];

const CUSTOMS_HOLDS = [
  {
    id: "YDK-INTL-000101",
    country: "China",
    flag: "🇨🇳",
    commodity: "Electronics",
    value: "$2,400",
    hold_reason: "HS Code mismatch",
    hold_since: "31h ago",
    status: "ESCALATED",
    documents: ["Commercial Invoice", "Packing List"],
    required_action: "Update HS code classification",
    facility: "PVG-HUB-02",
    next_review: "2026-05-24 09:00",
  },
  {
    id: "YDK-INTL-000059",
    country: "Brazil",
    flag: "🇧🇷",
    commodity: "Apparel",
    value: "$890",
    hold_reason: "Import license pending",
    hold_since: "18h ago",
    status: "UNDER_REVIEW",
    documents: ["Commercial Invoice", "Certificate of Origin"],
    required_action: "Obtain import license from ANCAP",
    facility: "GIG-HUB-01",
    next_review: "2026-05-24 14:00",
  },
  {
    id: "YDK-INTL-000042",
    country: "India",
    flag: "🇮🇳",
    commodity: "Medical Equipment",
    value: "$3,100",
    hold_reason: "Medical device registration",
    hold_since: "9h ago",
    status: "PENDING",
    documents: ["Commercial Invoice", "Bill of Lading"],
    required_action: "Submit CDSCO registration certificate",
    facility: "DEL-HUB-01",
    next_review: "2026-05-24 18:00",
  },
  {
    id: "YDK-INTL-000178",
    country: "United States",
    flag: "🇺🇸",
    commodity: "Textiles",
    value: "$1,250",
    hold_reason: "Quota compliance check",
    hold_since: "6h ago",
    status: "PENDING",
    documents: ["Commercial Invoice", "Quota Certificate"],
    required_action: "Verify quota allocation with CBP",
    facility: "JFK-HUB-01",
    next_review: "2026-05-24 16:00",
  },
  {
    id: "YDK-INTL-000165",
    country: "Germany",
    flag: "🇩🇪",
    commodity: "Machinery",
    value: "$8,500",
    hold_reason: "Technical specification mismatch",
    hold_since: "4h ago",
    status: "PENDING",
    documents: ["Commercial Invoice", "Technical Certificate"],
    required_action: "Provide CE certification",
    facility: "FRA-HUB-01",
    next_review: "2026-05-24 20:00",
  },
];

const DUTY_REVIEWS = [
  { id: "YDK-INTL-000195", country: "Japan", value: "$4,200", duty_rate: "0%", category: "Machinery", status: "APPROVED", reviewed_by: "Sarah Chen", date: "2026-05-23" },
  { id: "YDK-INTL-000182", country: "Singapore", value: "$950", duty_rate: "5%", category: "Electronics", status: "APPROVED", reviewed_by: "James Park", date: "2026-05-23" },
  { id: "YDK-INTL-000171", country: "Mexico", value: "$3,100", duty_rate: "3.5%", category: "Textiles", status: "PENDING", reviewed_by: "—", date: "—" },
  { id: "YDK-INTL-000158", country: "Thailand", value: "$2,800", duty_rate: "7%", category: "Apparel", status: "DISPUTED", reviewed_by: "Miguel Santos", date: "2026-05-22" },
];

const DOCUMENT_VERIFICATION = [
  { id: "YDK-INTL-000101", doc_type: "Commercial Invoice", status: "VERIFIED", verified_by: "System", date: "2026-05-23 14:22" },
  { id: "YDK-INTL-000101", doc_type: "Certificate of Origin", status: "PENDING", verified_by: "—", date: "—" },
  { id: "YDK-INTL-000059", doc_type: "Packing List", status: "VERIFIED", verified_by: "Customs Officer", date: "2026-05-23 12:45" },
  { id: "YDK-INTL-000042", doc_type: "Bill of Lading", status: "INCOMPLETE", verified_by: "—", date: "—" },
];

const STATUS_COLORS = {
  ESCALATED: "bg-red-50 text-red-700 border-red-200",
  UNDER_REVIEW: "bg-blue-50 text-blue-700 border-blue-200",
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  APPROVED: "bg-green-50 text-green-700 border-green-200",
  DISPUTED: "bg-orange-50 text-orange-700 border-orange-200",
  VERIFIED: "bg-green-50 text-green-700",
  INCOMPLETE: "bg-red-50 text-red-700",
};

const DOC_STATUS_ICON = {
  VERIFIED: <CheckCircle2 size={16} className="text-green-600" />,
  PENDING: <Clock size={16} className="text-amber-600" />,
  INCOMPLETE: <XCircle size={16} className="text-red-600" />,
};

// ─── Summary Card ─────────────────────────────────────────────────────────────
function SummaryCard({ label, value, icon: Icon, color, delta }) {
  return (
    <div className="bg-white rounded-lg border border-[#E2E8F0] p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-[#64748B] font-medium">{label}</p>
          <p className="text-3xl font-bold text-[#0F172A] mt-2">{value}</p>
          {delta && <p className="text-xs text-[#94A3B8] mt-1">{delta}</p>}
        </div>
        <div className={`${color} p-3 rounded-lg`}>
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}

// ─── Customs Hold Card ────────────────────────────────────────────────────────
function CustomsHoldCard({ hold }) {
  return (
    <div className="bg-white rounded-lg border border-[#E2E8F0] p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">{hold.flag}</span>
          <div className="flex-1">
            <p className="font-semibold text-[#0F172A]">{hold.id}</p>
            <p className="text-sm text-[#64748B]">{hold.country} • {hold.commodity}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${STATUS_COLORS[hold.status]}`}>
          {hold.status.replace(/_/g, " ")}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-[#94A3B8] uppercase tracking-wide">Hold Reason</p>
          <p className="text-sm font-medium text-[#0F172A] mt-1">{hold.hold_reason}</p>
        </div>
        <div>
          <p className="text-xs text-[#94A3B8] uppercase tracking-wide">Value</p>
          <p className="text-sm font-medium text-[#0F172A] mt-1">{hold.value}</p>
        </div>
        <div>
          <p className="text-xs text-[#94A3B8] uppercase tracking-wide">Holding Since</p>
          <p className="text-sm font-medium text-[#0F172A] mt-1">{hold.hold_since}</p>
        </div>
        <div>
          <p className="text-xs text-[#94A3B8] uppercase tracking-wide">Facility</p>
          <p className="text-sm font-medium text-[#0F172A] mt-1">{hold.facility}</p>
        </div>
      </div>

      <div className="bg-[#F8FAFC] rounded-lg p-3 mb-4">
        <p className="text-xs text-[#94A3B8] uppercase tracking-wide mb-2">Required Action</p>
        <p className="text-sm text-[#334155]">{hold.required_action}</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {hold.documents.map((doc, idx) => (
            <span key={idx} className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
              <FileText size={12} />
              {doc}
            </span>
          ))}
        </div>
        <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-[#0F172A] bg-[#F1F5F9] hover:bg-[#E2E8F0] rounded-lg transition-colors">
          <ChevronRight size={16} />
          Review
        </button>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function CustomsPage() {
  const [activeTab, setActiveTab] = useState("holds");

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      <Sidebar isAdmin />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />

        <div className="flex-1 overflow-auto">
          <div className="p-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-[#0F172A]">Customs Management</h1>
              <p className="text-[#64748B] mt-1">Holds • Duty reviews • Document verification • Compliance monitoring</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {CUSTOMS_SUMMARY.map((card, idx) => (
                <SummaryCard key={idx} {...card} />
              ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-[#E2E8F0] mb-6">
              {[
                { id: "holds", label: "Customs Holds", icon: Shield },
                { id: "duties", label: "Duty Reviews", icon: DollarSign },
                { id: "docs", label: "Document Verification", icon: FileText },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-2 px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                    activeTab === id
                      ? "text-[#0F172A] border-[#FFB800]"
                      : "text-[#64748B] border-transparent hover:text-[#0F172A]"
                  }`}
                >
                  <Icon size={16} />
                  {label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === "holds" && (
              <div className="space-y-4">
                <div className="flex gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                    <input
                      type="text"
                      placeholder="Search by tracking ID, country, or reason..."
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#E2E8F0] text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#FFB800]"
                    />
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E2E8F0] rounded-lg text-sm font-medium text-[#334155] hover:bg-[#F8FAFC]">
                    <Filter size={16} />
                    Filter
                  </button>
                </div>
                <div className="space-y-4">
                  {CUSTOMS_HOLDS.map((hold) => (
                    <CustomsHoldCard key={hold.id} hold={hold} />
                  ))}
                </div>
              </div>
            )}

            {activeTab === "duties" && (
              <div className="bg-white rounded-lg border border-[#E2E8F0] overflow-hidden">
                <table className="w-full">
                  <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                    <tr className="text-xs uppercase text-[#64748B] font-semibold">
                      <th className="px-6 py-4 text-left">Shipment ID</th>
                      <th className="px-6 py-4 text-left">Country</th>
                      <th className="px-6 py-4 text-left">Value</th>
                      <th className="px-6 py-4 text-left">Duty Rate</th>
                      <th className="px-6 py-4 text-left">Category</th>
                      <th className="px-6 py-4 text-left">Status</th>
                      <th className="px-6 py-4 text-left">Reviewed By</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DUTY_REVIEWS.map((duty) => (
                      <tr key={`${duty.id}-${duty.date}`} className="border-b border-[#E2E8F0] hover:bg-[#F8FAFC]">
                        <td className="px-6 py-4 font-mono text-sm text-[#0F172A]">{duty.id}</td>
                        <td className="px-6 py-4 text-sm text-[#334155]">{duty.country}</td>
                        <td className="px-6 py-4 text-sm font-medium text-[#0F172A]">{duty.value}</td>
                        <td className="px-6 py-4 text-sm text-[#0F172A]">{duty.duty_rate}</td>
                        <td className="px-6 py-4 text-sm text-[#64748B]">{duty.category}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${STATUS_COLORS[duty.status]}`}>
                            {duty.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-[#64748B]">{duty.reviewed_by}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "docs" && (
              <div className="bg-white rounded-lg border border-[#E2E8F0] overflow-hidden">
                <table className="w-full">
                  <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                    <tr className="text-xs uppercase text-[#64748B] font-semibold">
                      <th className="px-6 py-4 text-left">Shipment ID</th>
                      <th className="px-6 py-4 text-left">Document Type</th>
                      <th className="px-6 py-4 text-left">Status</th>
                      <th className="px-6 py-4 text-left">Verified By</th>
                      <th className="px-6 py-4 text-left">Date</th>
                      <th className="px-6 py-4 text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DOCUMENT_VERIFICATION.map((doc, idx) => (
                      <tr key={idx} className="border-b border-[#E2E8F0] hover:bg-[#F8FAFC]">
                        <td className="px-6 py-4 font-mono text-sm text-[#0F172A]">{doc.id}</td>
                        <td className="px-6 py-4 text-sm text-[#334155]">{doc.doc_type}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {DOC_STATUS_ICON[doc.status]}
                            <span className="text-sm font-medium text-[#0F172A]">{doc.status}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-[#64748B]">{doc.verified_by}</td>
                        <td className="px-6 py-4 text-sm text-[#64748B]">{doc.date}</td>
                        <td className="px-6 py-4 text-sm">
                          <button className="text-[#0F172A] hover:text-[#FFB800] font-medium flex items-center gap-1">
                            {doc.status === "VERIFIED" ? (
                              <>
                                <Download size={14} />
                                Download
                              </>
                            ) : (
                              <>
                                <Upload size={14} />
                                Upload
                              </>
                            )}
                          </button>
                        </td>
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
