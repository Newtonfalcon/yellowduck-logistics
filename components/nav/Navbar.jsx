"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Logo from "../Logo";
import {
  PUBLIC_NAV_LINKS,
  PUBLIC_NAV_CTA,
  PUBLIC_NAV_AUTH,
} from "@/constants";
import { Menu, X, Package } from "lucide-react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Add backdrop blur on scroll
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      {/* ── Top Bar ────────────────────────────────────────────────────── */}
      <header
        className={`
          fixed top-0 left-0 right-0 z-50 transition-all duration-300
          ${scrolled
            ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-[#E2E8F0]"
            : "bg-transparent"
          }
        `}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <Logo size="md" theme="dark" />
            </Link>

            {/* Desktop Nav Links */}
            <ul className="hidden lg:flex items-center gap-1">
              {PUBLIC_NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="
                      px-4 py-2 rounded-lg text-sm font-medium text-[#334155]
                      hover:text-[#0F172A] hover:bg-slate-100
                      transition-colors duration-150
                    "
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Desktop Right Actions */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Track CTA */}
              <Link
                href={PUBLIC_NAV_CTA.href}
                className="
                  flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold
                  bg-[#FFB800] text-[#0F172A]
                  hover:bg-[#F0AE00] active:scale-[0.98]
                  transition-all duration-150 shadow-sm
                "
              >
                <Package size={15} />
                {PUBLIC_NAV_CTA.label}
              </Link>

              <div className="w-px h-5 bg-slate-200" />

              <Link
                href={PUBLIC_NAV_AUTH.login.href}
                className="px-4 py-2 text-sm font-medium text-[#475569] hover:text-[#0F172A] transition-colors"
              >
                {PUBLIC_NAV_AUTH.login.label}
              </Link>

              <Link
                href={PUBLIC_NAV_AUTH.signup.href}
                className="
                  px-4 py-2 rounded-lg text-sm font-semibold
                  bg-[#0F172A] text-white
                  hover:bg-[#1E293B] active:scale-[0.98]
                  transition-all duration-150
                "
              >
                {PUBLIC_NAV_AUTH.signup.label}
              </Link>
            </div>

            {/* Mobile Hamburger */}
            <button
              className="lg:hidden p-2 rounded-lg text-[#334155] hover:bg-slate-100 transition-colors"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>
      </header>

      {/* ── Mobile Slide-Out Menu ──────────────────────────────────────── */}
      {/* Backdrop */}
      <div
        className={`
          fixed inset-0 z-40 bg-[#0F172A]/50 backdrop-blur-sm lg:hidden
          transition-opacity duration-300
          ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        className={`
          fixed top-0 right-0 bottom-0 z-50 w-80 max-w-[90vw]
          bg-white shadow-2xl lg:hidden
          flex flex-col
          transition-transform duration-300 ease-out
          ${mobileOpen ? "translate-x-0" : "translate-x-full"}
        `}
        role="dialog"
        aria-label="Mobile navigation"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-[#E2E8F0]">
          <Logo size="md" theme="dark" />
          <button
            className="p-2 rounded-lg text-[#64748B] hover:bg-slate-100 transition-colors"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Track CTA — prominent */}
        <div className="px-5 pt-5">
          <Link
            href={PUBLIC_NAV_CTA.href}
            onClick={() => setMobileOpen(false)}
            className="
              flex items-center justify-center gap-2 w-full py-3 rounded-xl
              bg-[#FFB800] text-[#0F172A] font-semibold text-sm
              hover:bg-[#F0AE00] transition-colors
            "
          >
            <Package size={16} />
            {PUBLIC_NAV_CTA.label}
          </Link>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto px-5 pt-4">
          <ul className="space-y-1">
            {PUBLIC_NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="
                    flex items-center gap-3 px-3 py-3 rounded-lg
                    text-[#334155] font-medium text-sm
                    hover:bg-slate-50 hover:text-[#0F172A]
                    transition-colors
                  "
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="my-4 border-t border-[#E2E8F0]" />

          {/* Auth links */}
          <div className="space-y-2">
            <Link
              href={PUBLIC_NAV_AUTH.login.href}
              onClick={() => setMobileOpen(false)}
              className="
                flex items-center justify-center w-full py-3 rounded-xl
                border border-[#E2E8F0] text-[#0F172A] font-semibold text-sm
                hover:bg-slate-50 transition-colors
              "
            >
              {PUBLIC_NAV_AUTH.login.label}
            </Link>
            <Link
              href={PUBLIC_NAV_AUTH.signup.href}
              onClick={() => setMobileOpen(false)}
              className="
                flex items-center justify-center w-full py-3 rounded-xl
                bg-[#0F172A] text-white font-semibold text-sm
                hover:bg-[#1E293B] transition-colors
              "
            >
              {PUBLIC_NAV_AUTH.signup.label}
            </Link>
          </div>
        </nav>

        {/* Footer note */}
        <div className="px-5 py-4 border-t border-[#E2E8F0]">
          <p className="text-xs text-[#94A3B8] text-center">
            hello@yellowduck.io · +1 (415) 555-0192
          </p>
        </div>
      </div>
    </>
  );
}