"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, ArrowRight, Shield, MapPin, Clock, Globe } from "lucide-react";
import { HERO } from "@/constants";

function TrackingSearch() {
  const [value, setValue] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleTrack = (event) => {
    event.preventDefault();
    const trackingId = value.trim();
    if (!trackingId) return;
    startTransition(() => {
      router.push(`/track/${encodeURIComponent(trackingId)}`);
    });
  };

  return (
    <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-3 w-full max-w-2xl mx-auto">
      <div className="relative flex-1">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
        <input
          type="text"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={HERO.tracking_placeholder}
          className="w-full rounded-2xl border border-[#E2E8F0] bg-white px-12 py-4 text-sm font-medium text-[#0F172A] placeholder:text-[#94A3B8] shadow-sm transition focus:border-[#FFB800] focus:outline-none focus:ring-2 focus:ring-[#FFB800]/20"
        />
      </div>
      <button
        type="submit"
        disabled={!value.trim() || isPending}
        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#FFB800] px-6 py-4 text-sm font-semibold text-[#0F172A] shadow-sm transition hover:bg-[#F0AE00] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#0F172A]/30 border-t-[#0F172A]" />
        ) : (
          <>
            {HERO.tracking_cta}
            <ArrowRight size={16} />
          </>
        )}
      </button>
    </form>
  );
}

function BenefitCard({ icon: Icon, title, description }) {
  return (
    <div className="rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F8FAFC] text-[#0F172A]">
        <Icon size={20} />
      </div>
      <h3 className="text-lg font-semibold text-[#0F172A]">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-[#64748B]">{description}</p>
    </div>
  );
}

export default function PublicTrackPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <section className="bg-white rounded-[32px] border border-[#E2E8F0] p-10 shadow-sm">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="space-y-6">
              <span className="inline-flex rounded-full bg-[#FEF3C7] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#92400E]">
                Public tracking
              </span>
              <div>
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#0F172A]">Track your shipment instantly.</h1>
                <p className="mt-4 max-w-2xl text-base leading-8 text-[#475569]">
                  Enter your Yellowduck tracking number to view live status, ETA, and route details. No account needed — just your package ID.
                </p>
              </div>
              <TrackingSearch />
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-[#EFF6FF] px-4 py-3 text-sm font-semibold text-[#1D4ED8]">
                  <span>Live status</span>
                </div>
                <div className="rounded-2xl bg-[#ECFDF5] px-4 py-3 text-sm font-semibold text-[#15803D]">
                  <span>No login required</span>
                </div>
                <div className="rounded-2xl bg-[#FEF3C7] px-4 py-3 text-sm font-semibold text-[#92400E]">
                  <span>24/7 support</span>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] bg-[#0F172A] p-8 text-white shadow-xl shadow-slate-900/10">
              <div className="mb-8 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-[#FBBF24]/20 text-[#FBBF24]">
                  <Globe size={20} />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.22em] text-[#CBD5E1]">Global tracking</p>
                  <p className="text-lg font-semibold">Worldwide shipment visibility</p>
                </div>
              </div>
              <p className="text-sm leading-7 text-[#CBD5E1]">
                Yellowduck supports packages across our entire carrier network, with live updates from pickup through final delivery. Your tracking ID is the only thing you need.
              </p>
              <div className="mt-10 grid gap-4">
                <div className="rounded-3xl bg-white/10 px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-[#CBD5E1]">Estimated visibility</p>
                  <p className="mt-2 text-xl font-semibold">99.97%</p>
                </div>
                <div className="rounded-3xl bg-white/10 px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-[#CBD5E1]">Average update latency</p>
                  <p className="mt-2 text-xl font-semibold"><span className="font-mono">&lt; 1s</span></p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-12 grid gap-5 sm:grid-cols-3">
          <BenefitCard
            icon={MapPin}
            title="Transparent routing"
            description="See exactly where your shipment is and how far it has traveled with a single tracking number."
          />
          <BenefitCard
            icon={Clock}
            title="Reassuring ETA"
            description="Receive a clear delivery window and status changes as your shipment moves through the network."
          />
          <BenefitCard
            icon={Shield}
            title="Customs-ready"
            description="Track customs clearance status and receive alerts for any required next steps."
          />
        </section>

        <section className="mt-12 rounded-[32px] border border-[#E2E8F0] bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#94A3B8]">Need help tracking?</p>
              <h2 className="mt-3 text-2xl font-semibold text-[#0F172A]">Still not finding your shipment?</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[#475569]">
                If your package does not appear after entering a valid tracking number, contact our support team and we&apos;ll help locate it in the system.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="mailto:hello@yellowduck.io"
                className="inline-flex items-center justify-center rounded-2xl bg-[#FFB800] px-5 py-3 text-sm font-semibold text-[#0F172A] hover:bg-[#F0AE00] transition"
              >
                Contact support
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-2xl border border-[#E2E8F0] bg-white px-5 py-3 text-sm font-semibold text-[#0F172A] hover:bg-slate-50 transition"
              >
                Back to home
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
