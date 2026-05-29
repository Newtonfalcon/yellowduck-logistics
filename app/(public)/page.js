"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import Logo from "@/components/Logo";
import {
  HERO,
  FEATURES_SECTION,
  FEATURES,
  TRUSTED_BY,
  CTA_BANNER,
  FOOTER_COLUMNS,
  FOOTER_SOCIALS,
  FOOTER_CONTACT,
  FOOTER_LEGAL,
  FOOTER_META,
} from "@/constants";
import {
  ArrowRight,
  Search,
  CheckCircle2,
  Twitter,
  Linkedin,
  Github,
  Facebook,
  Mail,
  Phone,
  ChevronRight,
  Sparkles,
  Zap,
} from "lucide-react";

// ─── Tracking Input ───────────────────────────────────────────────────────────
function TrackingInput() {
  const [value, setValue] = useState("");
  const router = useRouter();

  const handleTrack = (e) => {
    e.preventDefault();
    const id = value.trim();
    if (!id) return;
    router.push(`/track/${encodeURIComponent(id)}`);
  };

  return (
    <form
      onSubmit={handleTrack}
      className="flex flex-col sm:flex-row gap-3 w-full max-w-xl"
    >
      <div className="relative flex-1">
        <Search
          size={17}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={HERO.tracking_placeholder}
          className="
            w-full pl-11 pr-4 py-4 rounded-xl
            bg-white border border-[#E2E8F0]
            text-[#0F172A] placeholder:text-[#94A3B8]
            text-sm font-medium
            shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFB800] focus:border-transparent
            transition-all
          "
        />
      </div>
      <button
        type="submit"
        className="
          flex items-center justify-center gap-2
          px-6 py-4 rounded-xl
          bg-[#FFB800] text-[#0F172A]
          font-semibold text-sm
          hover:bg-[#F0AE00] active:scale-[0.98]
          transition-all duration-150 shadow-sm whitespace-nowrap
        "
      >
        {HERO.tracking_cta}
        <ArrowRight size={15} />
      </button>
    </form>
  );
}

// ─── Feature Card ─────────────────────────────────────────────────────────────
function FeatureCard({ feature, index }) {
  const Icon = feature.icon;
  return (
    <article
      className="
        group relative flex flex-col gap-4
        bg-white rounded-2xl border border-[#E2E8F0]
        p-7 hover:shadow-md hover:-translate-y-0.5
        transition-all duration-200
      "
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="w-11 h-11 rounded-xl bg-[#FFF8E6] flex items-center justify-center">
        <Icon size={20} className="text-[#FFB800]" strokeWidth={2} />
      </div>

      <div className="space-y-2">
        <h3 className="text-base font-semibold text-[#0F172A]">
          {feature.title}
        </h3>
        <p className="text-sm text-[#64748B] leading-relaxed">
          {feature.description}
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mt-auto">
        {feature.tags.map((tag) => (
          <span
            key={tag}
            className="
              inline-flex items-center gap-1 px-2.5 py-1
              rounded-full bg-[#F1F5F9] text-[#475569]
              text-[11px] font-semibold tracking-wide
            "
          >
            <CheckCircle2 size={10} className="text-[#22C55E]" />
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}

// ─── Footer Column ────────────────────────────────────────────────────────────
function FooterColumn({ column }) {
  return (
    <div className="space-y-3">
      <h4 className="text-xs font-semibold tracking-widest uppercase text-[#94A3B8]">
        {column.heading}
      </h4>
      <ul className="space-y-2.5">
        {column.links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="
                inline-flex items-center gap-2 text-sm text-[#CBD5E1]
                hover:text-white transition-colors
              "
            >
              {link.label}
              {link.badge && (
                <span className="px-1.5 py-0.5 rounded-full bg-[#FFB800]/20 text-[#FFB800] text-[9px] font-bold tracking-wide">
                  {link.badge}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Page Component ───────────────────────────────────────────────────────────
export default function LandingPage() {
  const ICON_MAP = { Twitter, Linkedin, Github, Facebook, Mail, Phone };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans antialiased">
      <main>
        {/* ═══════════════════════════════════════════════════════
            HERO SECTION
        ══════════════════════════════════════════════════════ */}
        <section className="relative pt-24 pb-20 lg:pt-36 lg:pb-28 overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden="true"
            style={{
              backgroundImage: `
                radial-gradient(circle at 20% 40%, rgba(255,184,0,0.07) 0%, transparent 50%),
                radial-gradient(circle at 80% 60%, rgba(15,23,42,0.04) 0%, transparent 50%)
              `,
            }}
          />

          <div
            className="absolute inset-0 pointer-events-none opacity-[0.025]"
            aria-hidden="true"
            style={{
              backgroundImage: `
                linear-gradient(to right, #0F172A 1px, transparent 1px),
                linear-gradient(to bottom, #0F172A 1px, transparent 1px)
              `,
              backgroundSize: "64px 64px",
            }}
          />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center text-center gap-8">

              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFB800]/12 border border-[#FFB800]/25">
                <Zap size={13} className="text-[#FFB800]" />
                <span className="text-xs font-semibold text-[#92670A] tracking-wide">
                  {HERO.eyebrow}
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[62px] font-extrabold text-[#0F172A] leading-[1.1] tracking-tight max-w-4xl">
                {HERO.headline.split("\n").map((line, i) => (
                  <span key={i}>
                    {i === 1 ? (
                      <>
                        <br />
                        <span className="relative">
                          <span className="relative z-10">{line}</span>
                          <span
                            className="absolute bottom-0.5 left-0 right-0 h-[6px] bg-[#FFB800]/30 -z-0 rounded"
                            aria-hidden="true"
                          />
                        </span>
                      </>
                    ) : (
                      line
                    )}
                  </span>
                ))}
              </h1>

              <p className="text-base sm:text-lg text-[#475569] leading-relaxed max-w-2xl">
                {HERO.subheadline}
              </p>

              <div className="w-full max-w-xl">
                <TrackingInput />
                <p className="mt-3 text-xs text-[#94A3B8]">
                  No account required · Updates every second
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 pt-4 w-full max-w-2xl">
                {HERO.stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="flex flex-col items-center gap-0.5"
                  >
                    <span className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
                      {stat.value}
                    </span>
                    <span className="text-xs text-[#64748B] font-medium text-center">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            TRUSTED BY
        ══════════════════════════════════════════════════════ */}
        <section className="py-10 border-y border-[#E2E8F0] bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-xs font-semibold tracking-widest text-[#94A3B8] uppercase text-center mb-6">
              {TRUSTED_BY.headline}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
              {TRUSTED_BY.companies.map((company) => (
                <span
                  key={company}
                  className="text-sm font-bold text-[#CBD5E1] hover:text-[#94A3B8] transition-colors cursor-default tracking-wide"
                >
                  {company}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            TRUST / FEATURES SECTION
        ══════════════════════════════════════════════════════ */}
        <section className="py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center text-center gap-4 mb-14">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0F172A]/6 border border-[#0F172A]/10">
                <Sparkles size={12} className="text-[#475569]" />
                <span className="text-xs font-semibold text-[#334155] tracking-wide">
                  {FEATURES_SECTION.eyebrow}
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight max-w-2xl leading-tight">
                {FEATURES_SECTION.headline}
              </h2>
              <p className="text-base text-[#64748B] max-w-xl leading-relaxed">
                {FEATURES_SECTION.subheadline}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {FEATURES.map((feature, index) => (
                <FeatureCard key={feature.id} feature={feature} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            CTA BANNER
        ══════════════════════════════════════════════════════ */}
        <section className="py-16 lg:py-20 bg-[#0F172A]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">

              <div className="text-center lg:text-left">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {CTA_BANNER.headline}
                </h2>
                <p className="mt-2 text-[#94A3B8] text-base">
                  {CTA_BANNER.subheadline}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
                <Link
                  href={CTA_BANNER.primary.href}
                  className="
                    flex items-center justify-center gap-2
                    px-6 py-3.5 rounded-xl
                    bg-[#FFB800] text-[#0F172A]
                    font-semibold text-sm
                    hover:bg-[#F0AE00] active:scale-[0.98]
                    transition-all duration-150 shadow-md
                    whitespace-nowrap
                  "
                >
                  {CTA_BANNER.primary.label}
                  <ArrowRight size={15} />
                </Link>
                <Link
                  href={CTA_BANNER.secondary.href}
                  className="
                    flex items-center justify-center gap-2
                    px-6 py-3.5 rounded-xl
                    border border-[#334155] text-[#94A3B8]
                    font-semibold text-sm
                    hover:border-[#475569] hover:text-white
                    transition-all duration-150
                    whitespace-nowrap
                  "
                >
                  {CTA_BANNER.secondary.label}
                  <ChevronRight size={15} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ═══════════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════════ */}
      <footer className="bg-[#0B1120] border-t border-[#1E293B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">

            <div className="lg:col-span-2 flex flex-col gap-5">
              <Logo size="md" theme="light" />
              <p className="text-sm text-[#64748B] leading-relaxed max-w-xs">
                {FOOTER_META.tagline}
              </p>

              <ul className="space-y-2">
                {FOOTER_CONTACT.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        className="inline-flex items-center gap-2 text-sm text-[#64748B] hover:text-[#94A3B8] transition-colors"
                      >
                        <Icon size={14} />
                        {item.label}
                      </a>
                    </li>
                  );
                })}
              </ul>

              <div className="flex items-center gap-2">
                {FOOTER_SOCIALS.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.href}
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={social.label}
                      className="
                        w-9 h-9 rounded-lg flex items-center justify-center
                        bg-[#1E293B] text-[#64748B]
                        hover:bg-[#334155] hover:text-white
                        transition-colors
                      "
                    >
                      <Icon size={16} />
                    </a>
                  );
                })}
              </div>
            </div>

            {FOOTER_COLUMNS.map((column) => (
              <FooterColumn key={column.heading} column={column} />
            ))}
          </div>

          <div className="py-5 border-t border-[#1E293B] flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-[#475569]">{FOOTER_META.copyright}</p>
            <nav className="flex flex-wrap items-center gap-5" aria-label="Legal">
              {FOOTER_LEGAL.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs text-[#475569] hover:text-[#64748B] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}