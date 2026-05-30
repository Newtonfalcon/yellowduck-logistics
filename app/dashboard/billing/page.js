"use client";

import { useState } from "react";
import Sidebar from "@/components/nav/Sidebar";
import Topbar from "@/app/dashboard/components/Navbar";
import {
  CreditCard,
  CheckCircle2,
  Zap,
  Package,
  Building2,
  ArrowRight,
  Plus,
  Trash2,
  Download,
} from "lucide-react";

// ─── Mock data ─────────────────────────────────────────────────────────────────
const CURRENT_PLAN = {
  name: "Starter",
  status: "Active",
  renewalDate: "Jul 1, 2026",
  price: "Free",
};

const PLANS = [
  {
    name: "Starter",
    price: "Free",
    priceSub: "Forever",
    icon: Package,
    current: true,
    features: ["Up to 50 shipments/month", "Real-time tracking dashboard", "Standard international shipping", "Email notifications"],
  },
  {
    name: "Business",
    price: "$149",
    priceSub: "/month",
    icon: Zap,
    current: false,
    badge: "Most Popular",
    features: ["Unlimited shipments", "Priority customs clearance", "Full API access + SDKs", "Dedicated account manager", "Advanced analytics"],
  },
  {
    name: "Enterprise",
    price: "Custom",
    priceSub: "",
    icon: Building2,
    current: false,
    features: ["Everything in Business", "Negotiated carrier rates", "SLA guarantees", "24/7 premium support"],
  },
];

const PAYMENT_METHODS = [
  { id: 1, brand: "Visa",       last4: "4242", expiry: "12/27", default: true },
  { id: 2, brand: "Mastercard", last4: "8888", expiry: "09/26", default: false },
];

const BILLING_HISTORY = [
  { id: "INV-2026-12", date: "Jun 1, 2026",  amount: "$0.00",   status: "Paid",    plan: "Starter" },
  { id: "INV-2026-11", date: "May 1, 2026",  amount: "$0.00",   status: "Paid",    plan: "Starter" },
  { id: "INV-2026-10", date: "Apr 1, 2026",  amount: "$0.00",   status: "Paid",    plan: "Starter" },
];

const BRAND_COLORS = {
  Visa:       "bg-blue-600",
  Mastercard: "bg-red-600",
};

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function BillingPage() {
  const [activeTab, setActiveTab] = useState("plan");

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar title="Billing" subtitle="Manage your plan and payment methods" />

        <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-6">

          {/* Header */}
          <div>
            <h2 className="text-xl font-extrabold text-[#0F172A]">Billing & Subscription</h2>
            <p className="text-sm text-[#64748B] mt-0.5">Manage your plan, payment methods, and billing history.</p>
          </div>

          {/* Current Plan Banner */}
          <div className="bg-[#0F172A] rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs text-[#64748B] uppercase tracking-widest font-semibold">Current Plan</p>
              <p className="text-2xl font-extrabold text-white mt-1">{CURRENT_PLAN.name}</p>
              <p className="text-sm text-[#64748B] mt-0.5">
                Renews {CURRENT_PLAN.renewalDate} · {CURRENT_PLAN.price}
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/15 text-green-400 text-xs font-bold border border-green-500/20">
              <CheckCircle2 size={12} /> {CURRENT_PLAN.status}
            </span>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 border-b border-[#E2E8F0]">
            {[
              { id: "plan",    label: "Plans" },
              { id: "payment", label: "Payment Methods" },
              { id: "history", label: "Billing History" },
            ].map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${
                  activeTab === id
                    ? "text-[#0F172A] border-[#FFB800]"
                    : "text-[#64748B] border-transparent hover:text-[#0F172A]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Plans Tab */}
          {activeTab === "plan" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {PLANS.map((plan) => {
                const Icon = plan.icon;
                return (
                  <div
                    key={plan.name}
                    className={`relative rounded-2xl border p-6 flex flex-col ${
                      plan.current
                        ? "border-[#FFB800] bg-[#FFF8E6]"
                        : "border-[#E2E8F0] bg-white"
                    }`}
                  >
                    {plan.badge && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="bg-[#FFB800] text-[#0F172A] text-xs font-bold px-3 py-1 rounded-full">
                          {plan.badge}
                        </span>
                      </div>
                    )}
                    {plan.current && (
                      <div className="absolute -top-3 right-4">
                        <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                          Current
                        </span>
                      </div>
                    )}

                    <div className="w-10 h-10 rounded-xl bg-[#F1F5F9] flex items-center justify-center mb-4">
                      <Icon size={18} className="text-[#64748B]" />
                    </div>
                    <h3 className="font-bold text-[#0F172A]">{plan.name}</h3>
                    <div className="mt-2 mb-4">
                      <span className="text-3xl font-extrabold text-[#0F172A]">{plan.price}</span>
                      {plan.priceSub && (
                        <span className="text-sm text-[#94A3B8]">{plan.priceSub}</span>
                      )}
                    </div>

                    <ul className="space-y-2 flex-1 mb-5">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-xs text-[#334155]">
                          <CheckCircle2 size={13} className="text-green-500 flex-shrink-0 mt-0.5" />
                          {f}
                        </li>
                      ))}
                    </ul>

                    <button
                      disabled={plan.current}
                      className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-bold transition-all ${
                        plan.current
                          ? "bg-[#F1F5F9] text-[#94A3B8] cursor-not-allowed"
                          : "bg-[#0F172A] text-white hover:bg-[#1E293B]"
                      }`}
                    >
                      {plan.current ? "Current Plan" : plan.name === "Enterprise" ? "Contact Sales" : "Upgrade"}
                      {!plan.current && <ArrowRight size={14} />}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Payment Methods Tab */}
          {activeTab === "payment" && (
            <div className="space-y-4">
              {PAYMENT_METHODS.map((method) => (
                <div
                  key={method.id}
                  className="bg-white rounded-2xl border border-[#E2E8F0] p-5 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className={`${BRAND_COLORS[method.brand]} text-white text-xs font-bold px-3 py-1.5 rounded-lg`}>
                      {method.brand}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#0F172A]">
                        •••• •••• •••• {method.last4}
                      </p>
                      <p className="text-xs text-[#64748B]">Expires {method.expiry}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {method.default && (
                      <span className="text-[10px] font-bold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                        Default
                      </span>
                    )}
                    <button className="p-1.5 text-[#CBD5E1] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}

              <button className="flex items-center gap-2 px-5 py-3 rounded-2xl border border-dashed border-[#E2E8F0] text-sm font-semibold text-[#64748B] hover:border-[#FFB800] hover:text-[#0F172A] transition-all w-full justify-center">
                <Plus size={15} />
                Add Payment Method
              </button>
            </div>
          )}

          {/* Billing History Tab */}
          {activeTab === "history" && (
            <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-sm">
              <table className="w-full text-sm">
                <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                  <tr>
                    {["Invoice", "Date", "Plan", "Amount", "Status", ""].map((h) => (
                      <th key={h} className="px-6 py-4 text-left text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F8FAFC]">
                  {BILLING_HISTORY.map((inv) => (
                    <tr key={inv.id} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="px-6 py-4 font-mono text-xs font-semibold text-[#0F172A]">{inv.id}</td>
                      <td className="px-6 py-4 text-xs text-[#64748B]">{inv.date}</td>
                      <td className="px-6 py-4 text-xs text-[#334155]">{inv.plan}</td>
                      <td className="px-6 py-4 text-xs font-semibold text-[#0F172A]">{inv.amount}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                          <CheckCircle2 size={10} /> {inv.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button className="flex items-center gap-1 text-xs text-[#64748B] hover:text-[#0F172A] transition-colors">
                          <Download size={13} /> PDF
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}