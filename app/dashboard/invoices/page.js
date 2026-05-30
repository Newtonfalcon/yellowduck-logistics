"use client";

import { useState, useMemo } from "react";
import Sidebar from "@/components/nav/Sidebar";
import Topbar from "@/app/dashboard/components/Navbar";
import {
  FileText,
  Download,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  ArrowUpRight,
  Filter,
} from "lucide-react";

// ─── Mock data ─────────────────────────────────────────────────────────────────
const INVOICES = [
  { id: "INV-2026-044", date: "May 23, 2026", due: "Jun 6, 2026",  amount: "$284.00", status: "Paid",    shipments: 8,  tracking: "YDK-INTL-000182" },
  { id: "INV-2026-043", date: "May 16, 2026", due: "May 30, 2026", amount: "$156.50", status: "Paid",    shipments: 4,  tracking: "YDK-INTL-000179" },
  { id: "INV-2026-042", date: "May 9, 2026",  due: "May 23, 2026", amount: "$412.00", status: "Paid",    shipments: 11, tracking: "YDK-INTL-000170" },
  { id: "INV-2026-041", date: "May 2, 2026",  due: "May 16, 2026", amount: "$89.00",  status: "Paid",    shipments: 2,  tracking: "YDK-INTL-000162" },
  { id: "INV-2026-040", date: "Apr 25, 2026", due: "May 9, 2026",  amount: "$320.75", status: "Paid",    shipments: 9,  tracking: "YDK-INTL-000155" },
  { id: "INV-2026-039", date: "Apr 18, 2026", due: "May 2, 2026",  amount: "$200.00", status: "Overdue", shipments: 5,  tracking: "YDK-INTL-000148" },
  { id: "INV-2026-038", date: "Apr 11, 2026", due: "Apr 25, 2026", amount: "$67.25",  status: "Paid",    shipments: 2,  tracking: "YDK-INTL-000140" },
];

const STATUS_STYLE = {
  Paid:    { bg: "bg-green-50", text: "text-green-700", border: "border-green-200", icon: CheckCircle2 },
  Pending: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", icon: Clock },
  Overdue: { bg: "bg-red-50",   text: "text-red-700",   border: "border-red-200",   icon: XCircle },
};

function StatusBadge({ status }) {
  const cfg = STATUS_STYLE[status] ?? STATUS_STYLE["Pending"];
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold border px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.text} ${cfg.border}`}>
      <Icon size={10} />
      {status}
    </span>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function InvoicesPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  const filtered = useMemo(() => {
    let list = INVOICES;
    if (filter !== "ALL") list = list.filter((inv) => inv.status === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (inv) =>
          inv.id.toLowerCase().includes(q) ||
          inv.tracking.toLowerCase().includes(q)
      );
    }
    return list;
  }, [search, filter]);

  const totalPaid = INVOICES.filter((i) => i.status === "Paid")
    .reduce((s, i) => s + parseFloat(i.amount.replace("$", "").replace(",", "")), 0)
    .toFixed(2);

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar title="Invoices" subtitle="View and download your transaction history" />

        <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-6">

          {/* Header */}
          <div>
            <h2 className="text-xl font-extrabold text-[#0F172A]">Invoice History</h2>
            <p className="text-sm text-[#64748B] mt-0.5">All shipment invoices tied to your account.</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-sm">
              <p className="text-[11px] text-[#94A3B8] font-bold uppercase tracking-wide">Total Invoices</p>
              <p className="text-3xl font-extrabold text-[#0F172A] mt-1">{INVOICES.length}</p>
            </div>
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-sm">
              <p className="text-[11px] text-[#94A3B8] font-bold uppercase tracking-wide">Total Paid</p>
              <p className="text-3xl font-extrabold text-[#0F172A] mt-1">${totalPaid}</p>
            </div>
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-sm">
              <p className="text-[11px] text-[#94A3B8] font-bold uppercase tracking-wide">Overdue</p>
              <p className="text-3xl font-extrabold text-red-600 mt-1">
                {INVOICES.filter((i) => i.status === "Overdue").length}
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
              <input
                type="text"
                placeholder="Search by invoice ID or tracking number…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E2E8F0] text-sm bg-white focus:outline-none focus:border-[#FFB800] focus:ring-2 focus:ring-[#FFB800]/20 transition-all"
              />
            </div>
            <div className="flex items-center gap-1 bg-white border border-[#E2E8F0] rounded-xl p-1">
              {["ALL", "Paid", "Overdue"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    filter === f
                      ? "bg-[#FFB800] text-[#0F172A] shadow-sm"
                      : "text-[#64748B] hover:text-[#0F172A]"
                  }`}
                >
                  {f === "ALL" ? "All" : f}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[640px]">
                <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                  <tr>
                    {["Invoice", "Date", "Due Date", "Shipments", "Amount", "Status", ""].map((h) => (
                      <th key={h} className="px-6 py-4 text-left text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F8FAFC]">
                  {filtered.map((inv) => (
                    <tr key={inv.id} className="hover:bg-[#F8FAFC] transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <FileText size={13} className="text-[#94A3B8] flex-shrink-0" />
                          <span className="font-mono text-xs font-semibold text-[#0F172A]">{inv.id}</span>
                        </div>
                        <p className="text-[10px] text-[#94A3B8] ml-5 mt-0.5">{inv.tracking}</p>
                      </td>
                      <td className="px-6 py-4 text-xs text-[#64748B]">{inv.date}</td>
                      <td className="px-6 py-4 text-xs text-[#64748B]">{inv.due}</td>
                      <td className="px-6 py-4 text-xs text-[#334155]">{inv.shipments}</td>
                      <td className="px-6 py-4 text-sm font-bold text-[#0F172A]">{inv.amount}</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={inv.status} />
                      </td>
                      <td className="px-6 py-4">
                        <button className="flex items-center gap-1.5 text-xs text-[#64748B] hover:text-[#0F172A] opacity-0 group-hover:opacity-100 transition-all">
                          <Download size={12} />
                          PDF
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filtered.length === 0 && (
              <div className="px-6 py-12 text-center text-sm text-[#64748B]">
                No invoices match your search.
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}