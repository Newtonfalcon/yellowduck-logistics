"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import Sidebar from "@/components/nav/Sidebar";
import Topbar from "@/app/dashboard/components/Navbar";
import { auth } from "@/lib/firebase/client";
import { getUserShipments } from "@/services/shipment.service";
import {
  Copy,
  RefreshCcw,
  Plus,
  Loader2,
  MapPin,
  ArrowUpRight,
  Shield,
  ChevronRight,
} from "lucide-react";

const STATUS_OPTIONS = [
  { value: "ALL", label: "All shipments" },
  { value: "LABEL_CREATED", label: "Label created" },
  { value: "IN_TRANSIT", label: "In transit" },
  { value: "CUSTOMS_HOLD", label: "Customs hold" },
  { value: "OUT_FOR_DELIVERY", label: "Out for delivery" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "EXCEPTION", label: "Exception" },
];

const STATUS_LABEL = {
  LABEL_CREATED: "Label created",
  IN_TRANSIT: "In transit",
  CUSTOMS_HOLD: "Customs hold",
  OUT_FOR_DELIVERY: "Out for delivery",
  DELIVERED: "Delivered",
  EXCEPTION: "Exception",
};

const STATUS_STYLE = {
  LABEL_CREATED: "bg-slate-100 text-slate-700",
  IN_TRANSIT: "bg-blue-50 text-blue-700",
  CUSTOMS_HOLD: "bg-amber-50 text-amber-700",
  OUT_FOR_DELIVERY: "bg-violet-50 text-violet-700",
  DELIVERED: "bg-green-50 text-green-700",
  EXCEPTION: "bg-red-50 text-red-700",
};

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold tracking-[0.02em] uppercase ${
        STATUS_STYLE[status] || "bg-slate-100 text-slate-700"
      }`}
    >
      {STATUS_LABEL[status] ?? status ?? "Unknown"}
    </span>
  );
}

function formatDate(timestamp) {
  if (!timestamp) {
    return "—";
  }

  if (typeof timestamp.toDate === "function") {
    return timestamp.toDate().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  return new Date(timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function DashboardShipmentsPage() {
  const [user, setUser] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const [shipments, setShipments] = useState([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [copySuccess, setCopySuccess] = useState("");

  const summary = useMemo(() => {
    const active = shipments.filter((shipment) => shipment.currentStatus !== "DELIVERED").length;
    const delivered = shipments.filter((shipment) => shipment.currentStatus === "DELIVERED").length;
    const exceptions = shipments.filter((shipment) => shipment.currentStatus === "EXCEPTION").length;

    return {
      total: shipments.length,
      active,
      delivered,
      exceptions,
    };
  }, [shipments]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setInitialized(true);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      return;
    }

    loadShipments({ replace: true });
  }, [user, statusFilter]);

  async function loadShipments({ replace = true } = {}) {
    if (!user) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await getUserShipments({
        userId: user.uid,
        userEmail: user.email,
        statusFilter: statusFilter === "ALL" ? null : statusFilter,
        pageSize: 12,
        lastDoc: replace ? null : lastDoc,
      });

      setShipments((current) => (replace ? response.shipments : [...current, ...response.shipments]));
      setLastDoc(response.lastDoc);
      setHasMore(response.hasMore);
    } catch (err) {
      console.error("[DashboardShipments]", err);
      setError(err?.message || "Unable to load shipments at this time.");
    } finally {
      setLoading(false);
    }
  }

  async function handleLoadMore() {
    if (!hasMore || loading) {
      return;
    }

    await loadShipments({ replace: false });
  }

  async function handleCopy(trackingNumber) {
    try {
      await navigator.clipboard.writeText(trackingNumber);
      setCopySuccess(trackingNumber);
      window.setTimeout(() => setCopySuccess(""), 1800);
    } catch (err) {
      console.error(err);
    }
  }

  if (!initialized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-4">
        <div className="inline-flex items-center gap-3 rounded-3xl border border-[#E2E8F0] bg-white px-6 py-5 text-sm text-slate-600 shadow-sm">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading your dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar title="Shipments" subtitle="Manage your shipment workflow and tracking" />

        <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#94A3B8]">Shipment workflow</p>
              <h1 className="mt-3 text-2xl font-semibold text-[#0F172A]">Your active shipments</h1>
              <p className="mt-2 max-w-2xl text-sm text-[#64748B]">
                View, filter, and track shipments created from your account. Only your authorized shipment history appears here.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => loadShipments({ replace: true })}
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-[#0F172A] shadow-sm ring-1 ring-[#E2E8F0] transition hover:bg-[#F8FAFC]"
              >
                <RefreshCcw size={16} />
                Refresh
              </button>

              <Link
                href="/dashboard/create"
                className="inline-flex items-center gap-2 rounded-2xl bg-[#FFB800] px-4 py-2 text-sm font-semibold text-[#0F172A] transition hover:bg-[#F0AE00]"
              >
                <Plus size={16} />
                New shipment
              </Link>
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-[2.25fr_1fr]">
            <section className="space-y-4">
              <div className="rounded-[28px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[#0F172A]">Shipments overview</p>
                    <p className="mt-1 text-sm text-[#64748B]">
                      Showing {shipments.length} shipment{shipments.length === 1 ? "" : "s"} for {user?.email || "your account"}.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <label className="text-sm font-medium text-[#334155]">Status filter</label>
                    <select
                      value={statusFilter}
                      onChange={(event) => setStatusFilter(event.target.value)}
                      className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-2 text-sm text-[#0F172A] outline-none transition focus:border-[#FFB800] focus:ring-2 focus:ring-[#FFB800]/20"
                    >
                      {STATUS_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="overflow-hidden rounded-[28px] border border-[#E2E8F0] bg-white shadow-sm">
                <div className="px-5 py-4 border-b border-[#E2E8F0] flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[#0F172A]">My shipments</p>
                    <p className="mt-1 text-sm text-[#64748B]">Track the current status and access the public tracking page for each shipment.</p>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                    {statusFilter === "ALL" ? "All statuses" : STATUS_LABEL[statusFilter]}
                  </span>
                </div>

                {loading && !shipments.length ? (
                  <div className="px-5 py-12 text-center text-sm text-[#475569] flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Loading shipments...
                  </div>
                ) : null}

                {!loading && !shipments.length ? (
                  <div className="px-5 py-16 text-center text-sm text-[#64748B]">
                    There are no shipments to show yet. Create a new shipment to begin tracking your logistics workflow.
                  </div>
                ) : null}

                {shipments.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm text-[#334155]">
                      <thead>
                        <tr className="text-xs uppercase tracking-[0.18em] text-[#94A3B8]">
                          <th className="px-5 py-4">Tracking</th>
                          <th className="px-5 py-4">Route</th>
                          <th className="px-5 py-4">Status</th>
                          <th className="px-5 py-4">Service</th>
                          <th className="px-5 py-4">Weight</th>
                          <th className="px-5 py-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {shipments.map((shipment) => {
                          const origin = shipment.sender?.address?.city || shipment.sender?.address?.country || "—";
                          const destination = shipment.recipient?.address?.city || shipment.recipient?.address?.country || "—";
                          const route = `${origin} → ${destination}`;
                          const createdAt = formatDate(shipment.createdAt);

                          return (
                            <tr key={shipment.id} className="border-t border-[#E2E8F0] last:border-b">
                              <td className="px-5 py-4 align-middle">
                                <div className="font-medium text-[#0F172A]">{shipment.trackingNumber || shipment.id}</div>
                                <div className="mt-1 text-xs text-[#64748B]">Created {createdAt}</div>
                              </td>
                              <td className="px-5 py-4 align-middle">
                                <div className="font-medium text-[#0F172A]">{route}</div>
                                <div className="mt-1 text-xs text-[#64748B]">
                                  {shipment.sender?.address?.country ?? "—"} → {shipment.recipient?.address?.country ?? "—"}
                                </div>
                              </td>
                              <td className="px-5 py-4 align-middle">
                                <StatusBadge status={shipment.currentStatus} />
                              </td>
                              <td className="px-5 py-4 align-middle text-[#475569]">
                                {shipment.pricing?.serviceCode ?? "Standard"}
                              </td>
                              <td className="px-5 py-4 align-middle text-[#475569]">
                                {shipment.package?.weightKg ? `${shipment.package.weightKg} kg` : "—"}
                              </td>
                              <td className="px-5 py-4 align-middle">
                                <div className="flex flex-wrap items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => handleCopy(shipment.trackingNumber || shipment.id)}
                                    className="inline-flex items-center gap-2 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-xs font-semibold text-[#0F172A] transition hover:bg-white"
                                  >
                                    <Copy size={14} />
                                    {copySuccess === shipment.trackingNumber ? "Copied" : "Copy"}
                                  </button>
                                  <Link
                                    href={`/track/${shipment.trackingNumber || shipment.id}`}
                                    className="inline-flex items-center gap-2 rounded-2xl bg-[#FFB800] px-3 py-2 text-xs font-semibold text-[#0F172A] transition hover:bg-[#F0AE00]"
                                  >
                                    <ArrowUpRight size={14} />
                                    Track
                                  </Link>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : null}

                {hasMore && !loading ? (
                  <div className="border-t border-[#E2E8F0] px-5 py-4 text-right">
                    <button
                      type="button"
                      onClick={handleLoadMore}
                      className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-[#0F172A] ring-1 ring-[#E2E8F0] transition hover:bg-[#F8FAFC]"
                    >
                      Load more shipments
                      <ChevronRight size={16} />
                    </button>
                  </div>
                ) : null}

                {error ? (
                  <div className="px-5 py-4 text-sm text-red-600">{error}</div>
                ) : null}
              </div>
            </section>

            <aside className="space-y-4">
              <div className="rounded-[28px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[#0F172A]">Shipment summary</p>
                    <p className="mt-1 text-sm text-[#64748B]">A quick view of the shipments currently loaded in your dashboard.</p>
                  </div>
                  <MapPin className="text-[#FFB800]" size={22} />
                </div>

                <div className="mt-6 grid gap-3">
                  <div className="rounded-3xl bg-[#F8FAFC] p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-[#94A3B8]">Loaded</p>
                    <p className="mt-2 text-2xl font-semibold text-[#0F172A]">{summary.total}</p>
                  </div>
                  <div className="rounded-3xl bg-[#F8FAFC] p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-[#94A3B8]">Active</p>
                    <p className="mt-2 text-2xl font-semibold text-[#0F172A]">{summary.active}</p>
                  </div>
                  <div className="rounded-3xl bg-[#F8FAFC] p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-[#94A3B8]">Delivered</p>
                    <p className="mt-2 text-2xl font-semibold text-[#0F172A]">{summary.delivered}</p>
                  </div>
                  <div className="rounded-3xl bg-[#F8FAFC] p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-[#94A3B8]">Exceptions</p>
                    <p className="mt-2 text-2xl font-semibold text-[#0F172A]">{summary.exceptions}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-[28px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[#0F172A]">Workflow guidance</p>
                    <p className="mt-1 text-sm text-[#64748B]">Your shipment workflow is built for fast dispatch, tracking, and shipment authorization.</p>
                  </div>
                  <Shield className="text-[#0F172A]" size={22} />
                </div>

                <ul className="mt-5 space-y-3 text-sm text-[#475569]">
                  <li className="flex gap-3">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-blue-500" />
                    Keep your sender email consistent with your account email for the most accurate authorization.
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-amber-500" />
                    Use the tracking link to open the public tracking page for any active shipment.
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-green-500" />
                    Refresh any time to reload the latest status from your authenticated shipment feed.
                  </li>
                </ul>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}
