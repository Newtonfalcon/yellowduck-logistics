"use client";

import { useState, useMemo } from "react";
import Sidebar from "@/components/nav/Sidebar";
import Topbar from "@/app/dashboard/components/Navbar";
import {
  Bell,
  Package,
  AlertTriangle,
  CheckCircle2,
  Shield,
  Info,
  Plane,
  Truck,
  X,
  Check,
} from "lucide-react";

// ─── Mock data ─────────────────────────────────────────────────────────────────
const RAW_NOTIFICATIONS = [
  {
    id: 1,
    type: "exception",
    title: "Customs Hold — YDK-INTL-000181",
    body: "Your shipment has been placed on customs hold at JFK. Documentation may be required.",
    time: "2 min ago",
    read: false,
    icon: AlertTriangle,
    iconColor: "bg-amber-50 text-amber-600",
  },
  {
    id: 2,
    type: "delivery",
    title: "Delivered — YDK-INTL-000180",
    body: "Your shipment to New York, US has been successfully delivered.",
    time: "3 hr ago",
    read: false,
    icon: CheckCircle2,
    iconColor: "bg-green-50 text-green-600",
  },
  {
    id: 3,
    type: "transit",
    title: "In Transit — YDK-INTL-000182",
    body: "Your shipment departed London Heathrow on flight YD4421. ETA: Jun 2, 2026.",
    time: "5 hr ago",
    read: false,
    icon: Plane,
    iconColor: "bg-blue-50 text-blue-600",
  },
  {
    id: 4,
    type: "system",
    title: "API Key Expiring Soon",
    body: "Your API key ending in ...a9f2 expires in 7 days. Rotate it in Settings to avoid disruption.",
    time: "Yesterday",
    read: true,
    icon: Shield,
    iconColor: "bg-purple-50 text-purple-600",
  },
  {
    id: 5,
    type: "delivery",
    title: "Out for Delivery — YDK-INTL-000179",
    body: "Your shipment is out for delivery in Dubai. Expected by end of day.",
    time: "Yesterday",
    read: true,
    icon: Truck,
    iconColor: "bg-blue-50 text-blue-600",
  },
  {
    id: 6,
    type: "system",
    title: "New Invoice Generated",
    body: "Invoice INV-2026-044 for $284.00 has been issued to your account.",
    time: "May 23",
    read: true,
    icon: Info,
    iconColor: "bg-slate-50 text-slate-500",
  },
  {
    id: 7,
    type: "delivery",
    title: "Delivered — YDK-INTL-000178",
    body: "Your shipment to Frankfurt has been successfully delivered.",
    time: "May 22",
    read: true,
    icon: CheckCircle2,
    iconColor: "bg-green-50 text-green-600",
  },
  {
    id: 8,
    type: "transit",
    title: "Shipment Picked Up — YDK-INTL-000182",
    body: "Courier has picked up your package from Lagos for international dispatch.",
    time: "May 21",
    read: true,
    icon: Package,
    iconColor: "bg-amber-50 text-amber-600",
  },
];

const FILTER_TABS = [
  { id: "ALL",       label: "All" },
  { id: "unread",    label: "Unread" },
  { id: "exception", label: "Exceptions" },
  { id: "delivery",  label: "Deliveries" },
  { id: "system",    label: "System" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(RAW_NOTIFICATIONS);
  const [filter, setFilter] = useState("ALL");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filtered = useMemo(() => {
    if (filter === "ALL")    return notifications;
    if (filter === "unread") return notifications.filter((n) => !n.read);
    return notifications.filter((n) => n.type === filter);
  }, [notifications, filter]);

  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  const markRead    = (id) => setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  const dismiss     = (id) => setNotifications((prev) => prev.filter((n) => n.id !== id));

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar title="Notifications" subtitle="Alerts, updates, and system logs" />

        <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-6">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-[#0F172A] flex items-center gap-2">
                Notifications
                {unreadCount > 0 && (
                  <span className="text-sm font-bold text-white bg-[#FFB800] px-2 py-0.5 rounded-full text-[#0F172A]">
                    {unreadCount}
                  </span>
                )}
              </h2>
              <p className="text-sm text-[#64748B] mt-0.5">
                {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}` : "All caught up!"}
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#E2E8F0] text-sm font-semibold text-[#64748B] bg-white hover:bg-[#F8FAFC] transition-colors self-start sm:self-auto"
              >
                <Check size={14} />
                Mark all as read
              </button>
            )}
          </div>

          {/* Filter tabs */}
          <div className="flex gap-1 bg-white border border-[#E2E8F0] rounded-xl p-1 w-fit overflow-x-auto">
            {FILTER_TABS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setFilter(id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  filter === id
                    ? "bg-[#FFB800] text-[#0F172A] shadow-sm"
                    : "text-[#64748B] hover:text-[#0F172A]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Notification List */}
          <div className="space-y-2">
            {filtered.length === 0 && (
              <div className="bg-white rounded-2xl border border-[#E2E8F0] px-6 py-12 text-center text-sm text-[#64748B] shadow-sm">
                No notifications here.
              </div>
            )}

            {filtered.map((notif) => {
              const Icon = notif.icon;
              return (
                <div
                  key={notif.id}
                  className={`bg-white rounded-2xl border shadow-sm px-5 py-4 flex items-start gap-4 transition-colors ${
                    !notif.read ? "border-[#FFB800]/40 bg-[#FFF8E6]/50" : "border-[#E2E8F0]"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${notif.iconColor}`}>
                    <Icon size={17} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <p className={`text-sm font-semibold ${!notif.read ? "text-[#0F172A]" : "text-[#334155]"}`}>
                        {notif.title}
                        {!notif.read && (
                          <span className="ml-2 inline-block w-1.5 h-1.5 rounded-full bg-[#FFB800] align-middle" />
                        )}
                      </p>
                      <span className="text-[11px] text-[#94A3B8] flex-shrink-0">{notif.time}</span>
                    </div>
                    <p className="text-xs text-[#64748B] mt-1 leading-relaxed">{notif.body}</p>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {!notif.read && (
                      <button
                        onClick={() => markRead(notif.id)}
                        title="Mark as read"
                        className="p-1.5 rounded-lg text-[#94A3B8] hover:text-green-600 hover:bg-green-50 transition-colors"
                      >
                        <Check size={13} />
                      </button>
                    )}
                    <button
                      onClick={() => dismiss(notif.id)}
                      title="Dismiss"
                      className="p-1.5 rounded-lg text-[#94A3B8] hover:text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <X size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}