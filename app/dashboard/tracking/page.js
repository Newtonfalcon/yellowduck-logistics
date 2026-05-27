"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import Sidebar from "@/components/nav/Sidebar";
import Topbar from "@/app/dashboard/components/Navbar";
import { auth } from "@/lib/firebase/client";
import {
  getUserShipments,
  getShipmentEvents,
  updateShipmentStatus,
  createShipmentEvent,
} from "@/services/shipment.service";
import {
  ArrowLeft,
  Loader2,
  MapPin,
  Package,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Plus,
} from "lucide-react";

const STATUS_OPTIONS = [
  { value: "LABEL_CREATED", label: "Label created" },
  { value: "IN_TRANSIT", label: "In transit" },
  { value: "CUSTOMS_HOLD", label: "Customs hold" },
  { value: "OUT_FOR_DELIVERY", label: "Out for delivery" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "EXCEPTION", label: "Exception" },
];

function formatDate(timestamp) {
  if (!timestamp) return "—";
  if (typeof timestamp.toDate === "function") {
    return timestamp.toDate().toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return String(timestamp);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function DashboardTrackingPage() {
  const [user, setUser] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const [shipments, setShipments] = useState([]);
  const [selectedShipmentId, setSelectedShipmentId] = useState("");
  const [status, setStatus] = useState("LABEL_CREATED");
  const [currentLocation, setCurrentLocation] = useState("");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const selectedShipment = useMemo(
    () => shipments.find((shipment) => shipment.id === selectedShipmentId) || null,
    [shipments, selectedShipmentId]
  );

  const loadShipments = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getUserShipments({
        userId: user.uid,
        userEmail: user.email,
        pageSize: 20,
      });

      setShipments(response.shipments);
      if (!selectedShipmentId && response.shipments.length > 0) {
        setSelectedShipmentId(response.shipments[0].id);
      }
    } catch (err) {
      console.error("[DashboardTracking] loadShipments", err);
      setError(err?.message || "Unable to load your shipments.");
    } finally {
      setLoading(false);
    }
  }, [user, selectedShipmentId]);

  async function loadEvents(shipmentId) {
    setEvents([]);
    try {
      const shipmentEvents = await getShipmentEvents(shipmentId);
      setEvents(shipmentEvents);
    } catch (err) {
      console.error("[DashboardTracking] loadEvents", err);
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setInitialized(true);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    async function refreshShipments() {
      if (!user) {
        setShipments([]);
        return;
      }

      await loadShipments();
    }

    refreshShipments();
  }, [user, loadShipments]);

  useEffect(() => {
    async function refreshSelectedShipment() {
      if (!selectedShipment) {
        setStatus("LABEL_CREATED");
        setCurrentLocation("");
        setEvents([]);
        return;
      }

      setStatus(selectedShipment.currentStatus || "LABEL_CREATED");
      setCurrentLocation(selectedShipment.currentLocation || "");
      await loadEvents(selectedShipment.id);
    }

    refreshSelectedShipment();
  }, [selectedShipment]);

  async function handleSave(event) {
    event.preventDefault();
    if (!selectedShipment) return;

    setSaving(true);
    setError("");
    setMessage("");

    try {
      await updateShipmentStatus({
        shipmentId: selectedShipment.id,
        status,
        extraFields: {
          currentLocation: currentLocation || selectedShipment.currentLocation || "",
        },
      });

      await createShipmentEvent({
        shipmentId: selectedShipment.id,
        status,
        location: currentLocation || selectedShipment.currentLocation || "Unknown location",
        description: `Status changed to ${status} and location updated to ${currentLocation || selectedShipment.currentLocation || "Unknown location"}`,
        author: user?.email || "System",
      });

      setMessage("Shipment updated successfully.");
      await loadShipments();
    } catch (err) {
      console.error("[DashboardTracking] save", err);
      setError(err?.message || "Unable to save shipment updates.");
    } finally {
      setSaving(false);
    }
  }

  if (!initialized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-4">
        <div className="inline-flex items-center gap-3 rounded-3xl border border-[#E2E8F0] bg-white px-6 py-5 text-sm text-slate-600 shadow-sm">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading tracking workspace...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-4">
        <div className="max-w-md rounded-[28px] border border-red-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-red-600">Not signed in</p>
          <h1 className="mt-4 text-xl font-semibold text-[#0F172A]">Sign in to manage your shipments</h1>
          <p className="mt-3 text-sm text-[#64748B]">You need an account to view and update tracking data for your packages.</p>
          <Link href="/auth/login" className="mt-6 inline-flex rounded-2xl bg-[#FFB800] px-5 py-3 text-sm font-semibold text-[#0F172A] transition hover:bg-[#F0AE00]">
            Go to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar title="Track shipment" subtitle="Manage your package location and status" />
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#94A3B8]">Tracking workspace</p>
              <h1 className="mt-2 text-2xl font-semibold text-[#0F172A]">My packages in transit</h1>
              <p className="mt-2 text-sm text-[#64748B]">Select a package below to update its current location and shipping status.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Link href="/dashboard/shipments" className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-[#0F172A] ring-1 ring-[#E2E8F0] transition hover:bg-[#F8FAFC]">
                <ArrowLeft size={16} />
                Back to shipments
              </Link>
              {selectedShipment ? (
                <Link
                  href={`/track/${selectedShipment.trackingNumber || selectedShipment.id}`}
                  className="inline-flex items-center gap-2 rounded-2xl bg-[#FFB800] px-4 py-2 text-sm font-semibold text-[#0F172A] transition hover:bg-[#F0AE00]"
                >
                  Track public
                </Link>
              ) : null}
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
            <section className="space-y-4">
              <div className="rounded-[28px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[#0F172A]">Packages assigned to you</p>
                    <p className="mt-1 text-sm text-[#64748B]">All shipments linked to your account are available for status updates.</p>
                  </div>
                  <div className="rounded-3xl bg-[#F8FAFC] px-4 py-3 text-sm text-[#0F172A]">
                    <p className="font-semibold">Total packages</p>
                    <p className="mt-1 text-lg">{shipments.length}</p>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  {loading ? (
                    <div className="rounded-3xl bg-[#F8FAFC] p-6 text-center text-sm text-[#64748B]">Loading your shipments…</div>
                  ) : shipments.length === 0 ? (
                    <div className="rounded-3xl bg-[#F8FAFC] p-6 text-center text-sm text-[#64748B]">No tracked shipments were found for your account.</div>
                  ) : (
                    <div className="space-y-3">
                      {shipments.map((shipment) => (
                        <button
                          key={shipment.id}
                          type="button"
                          onClick={() => setSelectedShipmentId(shipment.id)}
                          className={
                            `w-full rounded-3xl border px-4 py-4 text-left transition ${
                              selectedShipmentId === shipment.id
                                ? "border-[#FFB800] bg-[#FFFAEB]"
                                : "border-[#E2E8F0] bg-white hover:border-[#FFB800] hover:bg-[#F8FAFC]"
                            }`
                          }
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-[#0F172A] truncate">{shipment.trackingNumber || shipment.id}</p>
                              <p className="mt-1 text-xs text-[#64748B] truncate">{shipment.sender?.address?.city || "Unknown"} → {shipment.recipient?.address?.city || "Unknown"}</p>
                            </div>
                            <span className="rounded-full bg-[#F8FAFC] px-3 py-1 text-[11px] font-semibold text-[#334155] ring-1 ring-[#E2E8F0]">
                              {shipment.currentStatus || "Unknown"}
                            </span>
                          </div>
                          <div className="mt-3 flex flex-wrap gap-2 text-xs text-[#475569]">
                            <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 ring-1 ring-[#E2E8F0]">
                              <MapPin size={12} />
                              {shipment.currentLocation || "Location unset"}
                            </span>
                            <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 ring-1 ring-[#E2E8F0]">
                              <Package size={12} />
                              {shipment.package?.weightKg ? `${shipment.package.weightKg} kg` : "TBD"}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-[28px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[#0F172A]">Selected package</p>
                    <p className="mt-1 text-sm text-[#64748B]">Update status, location, and review recent events.</p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {selectedShipment ? (
                      <Link
                        href={`/track/${selectedShipment.trackingNumber || selectedShipment.id}`}
                        className="inline-flex items-center gap-2 rounded-2xl bg-[#FFB800] px-4 py-2 text-sm font-semibold text-[#0F172A] transition hover:bg-[#F0AE00]"
                      >
                        Track public
                      </Link>
                    ) : null}
                    <Shield className="text-[#0F172A]" size={22} />
                  </div>
                </div>

                {!selectedShipment ? (
                  <div className="mt-6 rounded-3xl bg-[#F8FAFC] p-6 text-sm text-[#64748B]">Choose a shipment from the list to begin editing.</div>
                ) : (
                  <div className="mt-6 space-y-4">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-3xl bg-[#F8FAFC] p-4">
                        <p className="text-[11px] uppercase tracking-[0.24em] text-[#94A3B8]">Tracking</p>
                        <p className="mt-2 text-sm font-semibold text-[#0F172A]">{selectedShipment.trackingNumber || selectedShipment.id}</p>
                      </div>
                      <div className="rounded-3xl bg-[#F8FAFC] p-4">
                        <p className="text-[11px] uppercase tracking-[0.24em] text-[#94A3B8]">Current</p>
                        <p className="mt-2 text-sm font-semibold text-[#0F172A]">{selectedShipment.currentLocation || "Not set"}</p>
                      </div>
                    </div>

                    <form className="space-y-4" onSubmit={handleSave}>
                      <div>
                        <label className="block text-xs font-semibold text-[#334155] mb-1.5">Shipment status</label>
                        <select
                          value={status}
                          onChange={(event) => setStatus(event.target.value)}
                          className="w-full rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-sm text-[#0F172A] outline-none transition focus:border-[#FFB800] focus:ring-2 focus:ring-[#FFB800]/20"
                        >
                          {STATUS_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#334155] mb-1.5">Current location</label>
                        <input
                          type="text"
                          value={currentLocation}
                          onChange={(event) => setCurrentLocation(event.target.value)}
                          placeholder="Enter a new location"
                          className="w-full rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-sm text-[#0F172A] outline-none transition focus:border-[#FFB800] focus:ring-2 focus:ring-[#FFB800]/20"
                        />
                      </div>

                      {message ? (
                        <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-3 text-sm text-emerald-700">{message}</div>
                      ) : null}
                      {error ? (
                        <div className="rounded-2xl bg-red-50 border border-red-200 p-3 text-sm text-red-700">{error}</div>
                      ) : null}

                      <button
                        type="submit"
                        disabled={saving}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#FFB800] px-4 py-3 text-sm font-semibold text-[#0F172A] transition hover:bg-[#F0AE00] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus size={16} />}
                        Save changes
                      </button>
                    </form>

                    <div className="rounded-3xl bg-[#F8FAFC] p-4">
                      <p className="text-xs uppercase tracking-[0.24em] text-[#94A3B8]">Latest events</p>
                      {events.length === 0 ? (
                        <p className="mt-3 text-sm text-[#64748B]">No update events have been logged yet.</p>
                      ) : (
                        <ul className="mt-3 space-y-3">
                          {events.slice(0, 4).map((eventItem) => (
                            <li key={eventItem.id} className="rounded-3xl border border-[#E2E8F0] bg-white p-3">
                              <div className="flex items-center justify-between gap-3">
                                <p className="text-sm font-semibold text-[#0F172A]">{eventItem.status}</p>
                                <span className="text-[11px] uppercase tracking-[0.24em] text-[#94A3B8]">{formatDate(eventItem.timestamp)}</span>
                              </div>
                              <p className="mt-2 text-sm text-[#64748B]">{eventItem.description}</p>
                              <div className="mt-3 flex flex-wrap gap-2 text-xs text-[#475569]">
                                <span className="inline-flex items-center gap-1 rounded-full bg-[#F8FAFC] px-2.5 py-1 ring-1 ring-[#E2E8F0]">
                                  <MapPin size={12} />
                                  {eventItem.location || "Unknown location"}
                                </span>
                                <span className="inline-flex items-center gap-1 rounded-full bg-[#F8FAFC] px-2.5 py-1 ring-1 ring-[#E2E8F0]">
                                  <Package size={12} />
                                  {eventItem.author || "System"}
                                </span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </section>

            <aside className="space-y-4">
              <div className="rounded-[28px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[#0F172A]">Quick details</p>
                    <p className="mt-1 text-sm text-[#64748B]">Snapshot of the selected shipment.</p>
                  </div>
                  <CheckCircle2 className="text-[#0F172A]" size={22} />
                </div>

                {selectedShipment ? (
                  <div className="mt-5 grid gap-3">
                    <div className="rounded-3xl bg-[#F8FAFC] p-4">
                      <p className="text-[11px] uppercase tracking-[0.24em] text-[#94A3B8]">Package</p>
                      <p className="mt-2 text-sm font-semibold text-[#0F172A]">{selectedShipment.package?.type ?? "Parcel"}</p>
                      <p className="mt-1 text-sm text-[#64748B]">{selectedShipment.package?.weightKg ? `${selectedShipment.package.weightKg} kg` : "Weight unavailable"}</p>
                    </div>
                    <div className="rounded-3xl bg-[#F8FAFC] p-4">
                      <p className="text-[11px] uppercase tracking-[0.24em] text-[#94A3B8]">Route</p>
                      <p className="mt-2 text-sm font-semibold text-[#0F172A]">{selectedShipment.sender?.address?.city ?? ""} → {selectedShipment.recipient?.address?.city ?? ""}</p>
                      <p className="mt-1 text-sm text-[#64748B]">{selectedShipment.sender?.address?.country ?? ""} → {selectedShipment.recipient?.address?.country ?? ""}</p>
                    </div>
                    <div className="rounded-3xl bg-[#F8FAFC] p-4">
                      <p className="text-[11px] uppercase tracking-[0.24em] text-[#94A3B8]">Created</p>
                      <p className="mt-2 text-sm font-semibold text-[#0F172A]">{formatDate(selectedShipment.createdAt)}</p>
                    </div>
                  </div>
                ) : (
                  <div className="mt-5 rounded-3xl bg-[#F8FAFC] p-6 text-sm text-[#64748B]">No shipment selected yet.</div>
                )}
              </div>

              <div className="rounded-[28px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[#0F172A]">Need help?</p>
                    <p className="mt-1 text-sm text-[#64748B]">Contact support if you need assistance updating a shipment.</p>
                  </div>
                  <AlertTriangle className="text-[#FFB800]" size={22} />
                </div>
                <div className="mt-5 space-y-3 text-sm text-[#475569]">
                  <p><span className="font-semibold">Email:</span> support@yellowduck.io</p>
                  <p><span className="font-semibold">Phone:</span> +1 (415) 555-0192</p>
                </div>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}
