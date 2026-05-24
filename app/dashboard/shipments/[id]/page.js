"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import Sidebar from "@/components/nav/Sidebar";
import Topbar from "@/app/dashboard/components/Navbar";
import { auth } from "@/lib/firebase/client";
import {
  getShipment,
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
  Clock,
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
  return new Date(timestamp).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function ShipmentDetailPage({ params }) {
  const shipmentId = params?.id;
  const [user, setUser] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const [shipment, setShipment] = useState(null);
  const [events, setEvents] = useState([]);
  const [status, setStatus] = useState("LABEL_CREATED");
  const [currentLocation, setCurrentLocation] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [authorized, setAuthorized] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setInitialized(true);
      if (!nextUser) {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user || !shipmentId) {
      return;
    }

    loadShipment();
  }, [user, shipmentId]);

  async function loadShipment() {
    setLoading(true);
    setError("");
    setAuthorized(true);

    try {
      const data = await getShipment(shipmentId);

      if (!data) {
        setError("Shipment not found.");
        setShipment(null);
        return;
      }

      const isAuthorized =
        data.customerId === user?.uid ||
        data.sender?.email?.toLowerCase() === user?.email?.toLowerCase();

      if (!isAuthorized) {
        setAuthorized(false);
        setShipment(null);
        return;
      }

      setShipment(data);
      setStatus(data.currentStatus || "LABEL_CREATED");
      setCurrentLocation(data.currentLocation || "");

      const eventList = await getShipmentEvents(shipmentId);
      setEvents(eventList);
    } catch (err) {
      console.error("[ShipmentDetail]", err);
      setError(err?.message || "Unable to load shipment details.");
      setShipment(null);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(event) {
    event.preventDefault();
    if (!shipment) return;

    setSaving(true);
    setError("");
    setSuccessMessage("");

    try {
      await updateShipmentStatus({
        shipmentId,
        status,
        extraFields: {
          currentLocation: currentLocation || shipment.currentLocation || "",
        },
      });

      await createShipmentEvent({
        shipmentId,
        status,
        location: currentLocation || shipment.currentLocation || "Unknown location",
        description: `Current location updated to ${currentLocation || "Unknown location"}`,
        author: user?.email || "System",
      });

      setSuccessMessage("Shipment location updated successfully.");
      await loadShipment();
    } catch (err) {
      console.error("[ShipmentDetail] update", err);
      setError(err?.message || "Unable to save shipment changes.");
    } finally {
      setSaving(false);
    }
  }

  if (!initialized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-4">
        <div className="inline-flex items-center gap-3 rounded-3xl border border-[#E2E8F0] bg-white px-6 py-5 text-sm text-slate-600 shadow-sm">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading shipment details...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-4">
        <div className="max-w-md rounded-[28px] border border-red-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-red-600">Not signed in</p>
          <h1 className="mt-4 text-xl font-semibold text-[#0F172A]">Sign in to view shipment details</h1>
          <p className="mt-3 text-sm text-[#64748B]">Please sign in before accessing this shipment.</p>
          <Link href="/auth/login" className="mt-6 inline-flex rounded-2xl bg-[#FFB800] px-5 py-3 text-sm font-semibold text-[#0F172A] transition hover:bg-[#F0AE00]">
            Go to login
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-4">
        <div className="inline-flex items-center gap-3 rounded-3xl border border-[#E2E8F0] bg-white px-6 py-5 text-sm text-slate-600 shadow-sm">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading shipment details...
        </div>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-4">
        <div className="max-w-md rounded-[28px] border border-red-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-red-600">Unauthorized</p>
          <h1 className="mt-4 text-xl font-semibold text-[#0F172A]">Access denied</h1>
          <p className="mt-3 text-sm text-[#64748B]">You are not authorized to view this shipment.</p>
          <Link href="/dashboard/shipments" className="mt-6 inline-flex rounded-2xl bg-[#FFB800] px-5 py-3 text-sm font-semibold text-[#0F172A] transition hover:bg-[#F0AE00]">
            <ArrowLeft size={16} />
            Back to shipments
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar title="Shipment detail" subtitle={`Shipment ${shipment?.trackingNumber || shipmentId}`} />
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#94A3B8]">Shipment workflow</p>
              <h1 className="mt-2 text-2xl font-semibold text-[#0F172A]">Shipment details</h1>
              <p className="mt-2 text-sm text-[#64748B]">
                Review the shipment audit trail and update the current location for this shipment.
              </p>
            </div>
            <Link href="/dashboard/shipments" className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-[#0F172A] ring-1 ring-[#E2E8F0] transition hover:bg-[#F8FAFC]">
              <ArrowLeft size={16} />
              Back
            </Link>
          </div>

          <div className="grid gap-4 xl:grid-cols-[2.25fr_1fr]">
            <section className="space-y-4">
              <div className="rounded-[28px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[#0F172A]">Shipment overview</p>
                    <div className="mt-3 text-sm text-[#64748B] space-y-1">
                      <p>Tracking number: <span className="font-medium text-[#0F172A]">{shipment.trackingNumber || shipment.id}</span></p>
                      <p>Status: <span className="font-medium text-[#0F172A]">{shipment.currentStatus}</span></p>
                      <p>Current location: <span className="font-medium text-[#0F172A]">{shipment.currentLocation || "Not set"}</span></p>
                    </div>
                  </div>
                  <div className="rounded-3xl bg-[#F8FAFC] p-4 text-sm text-[#0F172A]">
                    <p className="text-xs uppercase tracking-[0.24em] text-[#94A3B8]">Service</p>
                    <p className="mt-2 text-lg font-semibold">{shipment.pricing?.serviceCode ?? "Standard"}</p>
                    <p className="mt-1 text-sm text-[#64748B]">Total charge: ${shipment.pricing?.totalUSD?.toFixed(2) ?? "0.00"}</p>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl bg-[#F8FAFC] p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-[#94A3B8]">Sender</p>
                    <p className="mt-2 text-sm font-semibold text-[#0F172A]">{shipment.sender?.name}</p>
                    <p className="mt-1 text-sm text-[#64748B]">{shipment.sender?.company}</p>
                    <p className="mt-1 text-sm text-[#64748B]">{shipment.sender?.email}</p>
                  </div>
                  <div className="rounded-3xl bg-[#F8FAFC] p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-[#94A3B8]">Recipient</p>
                    <p className="mt-2 text-sm font-semibold text-[#0F172A]">{shipment.recipient?.name}</p>
                    <p className="mt-1 text-sm text-[#64748B]">{shipment.recipient?.company}</p>
                    <p className="mt-1 text-sm text-[#64748B]">{shipment.recipient?.email}</p>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl bg-[#F8FAFC] p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-[#94A3B8]">Route</p>
                    <p className="mt-2 text-sm text-[#0F172A]">{shipment.sender?.address?.city ?? ""} → {shipment.recipient?.address?.city ?? ""}</p>
                    <p className="mt-1 text-sm text-[#64748B]">{shipment.sender?.address?.country ?? ""} → {shipment.recipient?.address?.country ?? ""}</p>
                  </div>
                  <div className="rounded-3xl bg-[#F8FAFC] p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-[#94A3B8]">Package</p>
                    <p className="mt-2 text-sm text-[#0F172A]">{shipment.package?.type ?? "Parcel"}</p>
                    <p className="mt-1 text-sm text-[#64748B]">{shipment.package?.weightKg ?? "—"} kg</p>
                    <p className="mt-1 text-sm text-[#64748B]">{shipment.package?.contents ?? "—"}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-[28px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[#0F172A]">Shipment events</p>
                    <p className="mt-1 text-sm text-[#64748B]">Immutable event timeline for this shipment.</p>
                  </div>
                  <Clock className="text-[#FFB800]" size={22} />
                </div>

                <div className="mt-5 space-y-4">
                  {events.length === 0 ? (
                    <div className="rounded-3xl bg-[#F8FAFC] p-6 text-sm text-[#64748B]">No events recorded yet.</div>
                  ) : (
                    events.map((eventItem) => (
                      <div key={eventItem.id} className="rounded-3xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="font-semibold text-[#0F172A]">{eventItem.status}</p>
                            <p className="mt-1 text-sm text-[#64748B]">{eventItem.description}</p>
                          </div>
                          <span className="text-xs uppercase tracking-[0.18em] text-[#94A3B8]">{formatDate(eventItem.timestamp)}</span>
                        </div>
                        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-[#475569]">
                          <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-[#334155] ring-1 ring-[#E2E8F0]">
                            <MapPin size={12} />
                            {eventItem.location || "Unknown location"}
                          </span>
                          <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-[#334155] ring-1 ring-[#E2E8F0]">
                            <Package size={12} />
                            {eventItem.author || "System"}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </section>

            <aside className="space-y-4">
              <div className="rounded-[28px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[#0F172A]">Update shipment</p>
                    <p className="mt-1 text-sm text-[#64748B]">Edit current status and location for this shipment.</p>
                  </div>
                  <Shield className="text-[#0F172A]" size={22} />
                </div>

                <form className="mt-6 space-y-4" onSubmit={handleSave}>
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

                  {successMessage ? (
                    <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-3 text-sm text-emerald-700">{successMessage}</div>
                  ) : null}

                  {error ? (
                    <div className="rounded-2xl bg-red-50 border border-red-200 p-3 text-sm text-red-700">{error}</div>
                  ) : null}

                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#FFB800] px-4 py-3 text-sm font-semibold text-[#0F172A] transition hover:bg-[#F0AE00] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Plus size={16} />
                    )}
                    Save changes
                  </button>
                </form>
              </div>

              <div className="rounded-[28px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
                <p className="text-sm font-semibold text-[#0F172A]">Quick facts</p>
                <div className="mt-4 grid gap-3 text-sm text-[#475569]">
                  <div className="rounded-3xl bg-[#F8FAFC] p-4">
                    <p className="font-semibold text-[#0F172A]">Tracking number</p>
                    <p className="mt-2 text-sm">{shipment.trackingNumber || shipment.id}</p>
                  </div>
                  <div className="rounded-3xl bg-[#F8FAFC] p-4">
                    <p className="font-semibold text-[#0F172A]">Created</p>
                    <p className="mt-2 text-sm">{formatDate(shipment.createdAt)}</p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}
