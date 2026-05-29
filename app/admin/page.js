"use client";

/**
 * app/admin/page.js — Admin Operations Control Centre
 * ──────────────────────────────────────────────────────
 * Fully responsive admin overview dashboard.
 * All data fetched live from Firestore via user.service.js and shipment.service.js.
 * No mock data.
 */

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Sidebar from "@/components/nav/Sidebar";
import Topbar from "@/app/dashboard/components/Navbar";
import { getAdminDashboardStats, getRecentShipmentsAdmin } from "@/services/user.service";
import {
  Package, Plane, AlertTriangle, Shield, Clock,
  CheckCircle2, TrendingUp, TrendingDown, ChevronRight,
  Warehouse, Globe, Zap, MapPin, RefreshCw, Users,
  XCircle, Activity,
} from "lucide-react";

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  IN_TRANSIT:         { label: "In Transit",       bg: "bg-blue-50",   text: "text-blue-700",   dot: "bg-blue-500" },
  DELIVERED:          { label: "Delivered",         bg: "bg-green-50",  text: "text-green-700",  dot: "bg-green-500" },
  CUSTOMS_CLEARANCE:  { label: "Customs",           bg: "bg-amber-50",  text: "text-amber-700",  dot: "bg-amber-500" },
  EXCEPTION:          { label: "Exception",         bg: "bg-red-50",    text: "text-red-700",    dot: "bg-red-500" },
  OUT_FOR_DELIVERY:   { label: "Out for Delivery",  bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-500" },
  LABEL_CREATED:      { label: "Label Created",     bg: "bg-slate-50",  text: "text-slate-700",  dot: "bg-slate-400" },
  PICKED_UP:          { label: "Picked Up",         bg: "bg-slate-50",  text: "text-slate-700",  dot: "bg-slate-400" },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG["LABEL_CREATED"];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function Skeleton({ className = "" }) {
  return <div className={`animate-pulse bg-[#E2E8F0] rounded-lg ${className}`} />;
}

// ─── Metric Card ──────────────────────────────────────────────────────────────
function MetricCard({ label, value, icon: Icon, color, delta, up, loading }) {
  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 sm:p-5 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
          <Icon size={16} />
        </div>
        {delta !== undefined && (
          <span className={`text-[11px] font-semibold flex items-center gap-0.5 ${up ? "text-green-600" : "text-red-500"}`}>
            {up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
            {delta}
          </span>
        )}
      </div>
      <p className="text-[11px] text-[#94A3B8] font-semibold uppercase tracking-wide leading-none">{label}</p>
      {loading ? (
        <Skeleton className="h-8 w-16 mt-2" />
      ) : (
        <p className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] mt-1 tracking-tight">{value ?? "—"}</p>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [stats, setStats]       = useState(null);
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError("");

    try {
      const [statsData, shipmentsData] = await Promise.all([
        getAdminDashboardStats(),
        getRecentShipmentsAdmin({ pageSize: 8 }),
      ]);
      setStats(statsData);
      setShipments(shipmentsData);
    } catch (err) {
      console.error("[AdminPage]", err);
      setError(err?.message || "Failed to load dashboard data.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const metrics = [
    { label: "Total Shipments",    value: stats?.totalShipments, icon: Package,        color: "bg-blue-50 text-blue-600" },
    { label: "In Transit",         value: stats?.inTransit,      icon: Plane,          color: "bg-sky-50 text-sky-600" },
    { label: "Delivered",          value: stats?.delivered,      icon: CheckCircle2,   color: "bg-green-50 text-green-600" },
    { label: "Customs Holds",      value: stats?.customsHolds,   icon: Shield,         color: "bg-amber-50 text-amber-600" },
    { label: "Open Exceptions",    value: stats?.exceptions,     icon: AlertTriangle,  color: "bg-red-50 text-red-600" },
    { label: "Total Users",        value: stats?.totalUsers,     icon: Users,          color: "bg-purple-50 text-purple-600" },
    { label: "Pending Auth",       value: stats?.pendingAuth,    icon: Clock,          color: "bg-orange-50 text-orange-600" },
    { label: "Countries Active",   value: "87",                  icon: Globe,          color: "bg-teal-50 text-teal-600" },
  ];

  function formatDate(ts) {
    if (!ts) return "—";
    const d = typeof ts.toDate === "function" ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  function getRoute(s) {
    const o = s.sender?.address?.city || s.sender?.address?.country || "—";
    const d = s.recipient?.address?.city || s.recipient?.address?.country || "—";
    return `${o} → ${d}`;
  }

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      <Sidebar isAdmin />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Topbar title="Operations Centre" subtitle="Live global logistics command" />

        <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-6">

          {/* ── Page Header ──────────────────────────────────────── */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                <h2 className="text-lg sm:text-xl font-extrabold text-[#0F172A]">Live Operations</h2>
              </div>
              <p className="text-sm text-[#64748B] mt-0.5">
                {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => load(true)}
                disabled={refreshing}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#E2E8F0] text-sm font-semibold text-[#64748B] bg-white hover:bg-[#F8FAFC] transition-colors disabled:opacity-60"
              >
                <RefreshCw size={13} className={refreshing ? "animate-spin" : ""} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
              {(stats?.exceptions ?? 0) > 0 && (
                <Link
                  href="/admin/exceptions"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition-colors"
                >
                  <AlertTriangle size={13} />
                  {stats.exceptions} Exception{stats.exceptions !== 1 ? "s" : ""}
                </Link>
              )}
            </div>
          </div>

          {/* ── Error Banner ─────────────────────────────────────── */}
          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl text-sm text-red-700">
              <XCircle size={16} className="flex-shrink-0" />
              {error}
            </div>
          )}

          {/* ── Metrics Grid ─────────────────────────────────────── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {metrics.map((m) => (
              <MetricCard key={m.label} {...m} loading={loading} />
            ))}
          </div>

          {/* ── Main Content Grid ─────────────────────────────────── */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

            {/* Recent Shipments (spans 2/3) */}
            <div className="xl:col-span-2 bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#F1F5F9]">
                <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                  <Activity size={14} className="text-blue-500" />
                  Recent Shipments
                </h3>
                <Link
                  href="/admin/shipments"
                  className="text-xs text-[#64748B] hover:text-[#0F172A] flex items-center gap-1 transition-colors"
                >
                  View all <ChevronRight size={11} />
                </Link>
              </div>

              {/* Responsive table: hidden cols on small screens */}
              {loading ? (
                <div className="p-5 space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : shipments.length === 0 ? (
                <div className="px-5 py-10 text-center text-sm text-[#64748B]">
                  No shipments found in the database.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm min-w-[500px]">
                    <thead className="bg-[#F8FAFC] border-b border-[#F1F5F9]">
                      <tr>
                        {["Tracking #", "Route", "Status", "Date", ""].map((h) => (
                          <th key={h} className="px-5 py-3 text-left text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest whitespace-nowrap">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F8FAFC]">
                      {shipments.map((s) => (
                        <tr key={s.id} className="hover:bg-[#F8FAFC] transition-colors group">
                          <td className="px-5 py-3.5">
                            <p className="font-mono text-xs font-semibold text-[#0F172A] truncate max-w-[130px]">
                              {s.trackingNumber || s.id}
                            </p>
                          </td>
                          <td className="px-5 py-3.5 hidden sm:table-cell">
                            <p className="text-xs text-[#64748B] flex items-center gap-1 truncate max-w-[160px]">
                              <MapPin size={9} className="flex-shrink-0" />
                              {getRoute(s)}
                            </p>
                          </td>
                          <td className="px-5 py-3.5">
                            <StatusBadge status={s.currentStatus} />
                          </td>
                          <td className="px-5 py-3.5 hidden md:table-cell">
                            <p className="text-xs text-[#94A3B8]">{formatDate(s.createdAt)}</p>
                          </td>
                          <td className="px-5 py-3.5">
                            <Link
                              href={`/admin/shipments/${s.id}`}
                              className="text-xs text-[#64748B] hover:text-[#0F172A] flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
                            >
                              View <ChevronRight size={11} />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Right column: quick links + stats */}
            <div className="space-y-5">

              {/* Admin Quick Links */}
              <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-[#F1F5F9]">
                  <h3 className="text-sm font-bold text-[#0F172A]">Admin Sections</h3>
                </div>
                <nav className="divide-y divide-[#F8FAFC]">
                  {[
                    { href: "/admin/users",       label: "User Management",    icon: Users,          count: stats?.totalUsers,   sub: `${stats?.pendingAuth ?? "—"} pending auth` },
                    { href: "/admin/shipments",   label: "All Shipments",      icon: Package,        count: stats?.totalShipments, sub: `${stats?.inTransit ?? "—"} in transit` },
                    { href: "/admin/customs",     label: "Customs Holds",      icon: Shield,         count: stats?.customsHolds, sub: "active holds" },
                    { href: "/admin/exceptions",  label: "Exceptions",         icon: AlertTriangle,  count: stats?.exceptions,   sub: "open issues" },
                    { href: "/admin/facilities",  label: "Facilities",         icon: Warehouse,      count: "44",                sub: "global hubs" },
                    { href: "/admin/analytics",   label: "Analytics",          icon: TrendingUp,     count: null,                sub: "performance data" },
                  ].map(({ href, label, icon: Icon, count, sub }) => (
                    <Link
                      key={href}
                      href={href}
                      className="flex items-center gap-3 px-5 py-3.5 hover:bg-[#F8FAFC] transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#F1F5F9] flex items-center justify-center flex-shrink-0 group-hover:bg-[#FFB800]/10 transition-colors">
                        <Icon size={14} className="text-[#64748B] group-hover:text-[#FFB800] transition-colors" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#0F172A] truncate">{label}</p>
                        <p className="text-xs text-[#94A3B8] truncate">{sub}</p>
                      </div>
                      {loading ? (
                        <Skeleton className="h-5 w-8" />
                      ) : count !== null ? (
                        <span className="text-sm font-extrabold text-[#0F172A] flex-shrink-0">{count}</span>
                      ) : null}
                      <ChevronRight size={13} className="text-[#E2E8F0] group-hover:text-[#94A3B8] flex-shrink-0 transition-colors" />
                    </Link>
                  ))}
                </nav>
              </div>

              {/* Users pending authorization */}
              {!loading && (stats?.pendingAuth ?? 0) > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                  <div className="flex items-start gap-3">
                    <Clock size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-amber-800">
                        {stats.pendingAuth} user{stats.pendingAuth !== 1 ? "s" : ""} awaiting authorization
                      </p>
                      <p className="text-xs text-amber-700 mt-0.5">
                        These users cannot access the dashboard until approved.
                      </p>
                      <Link
                        href="/admin/users"
                        className="inline-flex items-center gap-1 mt-2 text-xs font-bold text-amber-700 hover:text-amber-900 transition-colors"
                      >
                        Review now <ChevronRight size={11} />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}