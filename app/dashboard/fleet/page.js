"use client";

import { useState, useMemo } from "react";
import Sidebar from "@/components/nav/Sidebar";
import Topbar from "@/app/dashboard/components/Navbar";
import {
  Truck,
  Plane,
  Package,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Search,
  Filter,
  Plus,
} from "lucide-react";

// ─── Mock data ─────────────────────────────────────────────────────────────────
const SUMMARY = [
  { label: "Total Assets",   value: "24",  icon: Truck,        color: "bg-blue-50 text-blue-600" },
  { label: "Active",         value: "18",  icon: CheckCircle2, color: "bg-green-50 text-green-600" },
  { label: "In Maintenance", value: "4",   icon: Clock,        color: "bg-amber-50 text-amber-600" },
  { label: "Alerts",         value: "2",   icon: AlertTriangle,color: "bg-red-50 text-red-600" },
];

const FLEET = [
  { id: "YD-TRK-001", type: "Ground",    name: "Lagos Metro Runner", status: "Active",      location: "Lagos, NG",      load: 82, driver: "Eze Nwachukwu",  lastSeen: "2 min ago" },
  { id: "YD-TRK-002", type: "Ground",    name: "Ikeja City Hauler",  status: "Active",      location: "Ikeja, NG",      load: 67, driver: "Amara Obi",      lastSeen: "5 min ago" },
  { id: "YD-AIR-003", type: "Air",       name: "Yellowduck Air 01",  status: "Active",      location: "LHR → DXB",      load: 91, driver: "Flight YD4421",  lastSeen: "1 min ago" },
  { id: "YD-AIR-004", type: "Air",       name: "Yellowduck Air 02",  status: "Active",      location: "JFK → LHR",      load: 78, driver: "Flight YD8832",  lastSeen: "3 min ago" },
  { id: "YD-TRK-005", type: "Ground",    name: "London Last Mile",   status: "Maintenance", location: "LHR Depot",      load: 0,  driver: "—",              lastSeen: "2 hr ago" },
  { id: "YD-VAN-006", type: "Van",       name: "Dubai Delivery 01",  status: "Active",      location: "Dubai, AE",      load: 55, driver: "Khalid Hassan",  lastSeen: "8 min ago" },
  { id: "YD-VAN-007", type: "Van",       name: "Singapore Express",  status: "Active",      location: "Singapore, SG",  load: 43, driver: "Li Wei",         lastSeen: "12 min ago" },
  { id: "YD-TRK-008", type: "Ground",    name: "Frankfurt Hub Runner",status: "Alert",      location: "FRA Depot",      load: 0,  driver: "Klaus Müller",   lastSeen: "47 min ago" },
];

const TYPE_ICONS = {
  Air:    Plane,
  Ground: Truck,
  Van:    Package,
};

const STATUS_CONFIG = {
  Active:      { dot: "bg-green-400", text: "text-green-700", bg: "bg-green-50",  label: "Active" },
  Maintenance: { dot: "bg-amber-400", text: "text-amber-700", bg: "bg-amber-50",  label: "Maintenance" },
  Alert:       { dot: "bg-red-400",   text: "text-red-700",   bg: "bg-red-50",    label: "Alert" },
};

function LoadBar({ pct, status }) {
  const color = status === "Active" && pct > 85
    ? "bg-amber-400"
    : status !== "Active"
    ? "bg-[#E2E8F0]"
    : "bg-[#FFB800]";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden max-w-[80px]">
        <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-bold text-[#0F172A] w-7">{pct}%</span>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function FleetPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");

  const filtered = useMemo(() => {
    let list = FLEET;
    if (typeFilter !== "ALL") list = list.filter((v) => v.type === typeFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (v) =>
          v.id.toLowerCase().includes(q) ||
          v.name.toLowerCase().includes(q) ||
          v.location.toLowerCase().includes(q)
      );
    }
    return list;
  }, [search, typeFilter]);

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar title="Fleet" subtitle="Vehicle and asset management" />

        <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-6">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-[#0F172A]">Fleet Management</h2>
              <p className="text-sm text-[#64748B] mt-0.5">Live status for all vehicles and assets.</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FFB800] text-[#0F172A] text-sm font-bold hover:bg-[#F0AE00] transition-colors self-start sm:self-auto">
              <Plus size={14} />
              Add Asset
            </button>
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

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
              <input
                type="text"
                placeholder="Search by ID, name, or location…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E2E8F0] text-sm bg-white focus:outline-none focus:border-[#FFB800] placeholder:text-[#CBD5E1]"
              />
            </div>
            <div className="flex items-center gap-1 bg-white border border-[#E2E8F0] rounded-xl p-1">
              {["ALL", "Ground", "Air", "Van"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    typeFilter === t
                      ? "bg-[#FFB800] text-[#0F172A] shadow-sm"
                      : "text-[#64748B] hover:text-[#0F172A]"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Fleet Table */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[700px]">
                <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                  <tr>
                    {["Asset", "Type", "Status", "Load", "Location", "Driver / Flight", "Last Seen"].map((h) => (
                      <th key={h} className="px-5 py-3.5 text-left text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F8FAFC]">
                  {filtered.map((vehicle) => {
                    const sc  = STATUS_CONFIG[vehicle.status];
                    const TypeIcon = TYPE_ICONS[vehicle.type] ?? Truck;
                    return (
                      <tr key={vehicle.id} className="hover:bg-[#F8FAFC] transition-colors">
                        <td className="px-5 py-4">
                          <p className="font-mono text-xs font-bold text-[#0F172A]">{vehicle.id}</p>
                          <p className="text-xs text-[#64748B] mt-0.5">{vehicle.name}</p>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1.5">
                            <TypeIcon size={14} className="text-[#64748B]" />
                            <span className="text-xs text-[#64748B]">{vehicle.type}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${sc.dot}`} />
                            <span className={`text-xs font-semibold ${sc.text}`}>{sc.label}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 w-32">
                          <LoadBar pct={vehicle.load} status={vehicle.status} />
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1 text-xs text-[#64748B]">
                            <MapPin size={11} />
                            {vehicle.location}
                          </div>
                        </td>
                        <td className="px-5 py-4 text-xs text-[#334155]">{vehicle.driver}</td>
                        <td className="px-5 py-4 text-xs text-[#94A3B8]">{vehicle.lastSeen}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filtered.length === 0 && (
              <div className="px-6 py-10 text-center text-sm text-[#64748B]">No assets match your filter.</div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}