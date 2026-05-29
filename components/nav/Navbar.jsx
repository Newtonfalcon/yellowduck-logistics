"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "../Logo";
import { Menu, X, Package } from "lucide-react";

const NAV_LINKS = [
  { label: "About", href: "/about" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
  { label: "Track Package", href: "/track" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  // Close on navigation
  useEffect(() => setMobileOpen(false), [pathname]);

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
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`
                        px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150
                        ${isActive
                          ? "text-[#0F172A] bg-[#FFB800]/10 font-semibold"
                          : "text-[#334155] hover:text-[#0F172A] hover:bg-slate-100"
                        }
                      `}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Desktop Right Actions */}
            <div className="hidden lg:flex items-center gap-3">
              <Link
                href="/track"
                className="
                  flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold
                  bg-[#FFB800] text-[#0F172A]
                  hover:bg-[#F0AE00] active:scale-[0.98]
                  transition-all duration-150 shadow-sm
                "
              >
                <Package size={15} />
                Track Package
              </Link>

              <div className="w-px h-5 bg-slate-200" />

              <Link
                href="/auth/login"
                className="px-4 py-2 text-sm font-medium text-[#475569] hover:text-[#0F172A] transition-colors"
              >
                Log in
              </Link>

              <Link
                href="/auth/register"
                className="
                  px-4 py-2 rounded-lg text-sm font-semibold
                  bg-[#0F172A] text-white
                  hover:bg-[#1E293B] active:scale-[0.98]
                  transition-all duration-150
                "
              >
                Get Started
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

      {/* ── Mobile Backdrop ──────────────────────────────────────────────── */}
      <div
        className={`
          fixed inset-0 z-40 bg-[#0F172A]/50 backdrop-blur-sm lg:hidden
          transition-opacity duration-300
          ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      {/* ── Mobile Drawer ─────────────────────────────────────────────────── */}
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

        <div className="px-5 pt-5">
          <Link
            href="/track"
            onClick={() => setMobileOpen(false)}
            className="
              flex items-center justify-center gap-2 w-full py-3 rounded-xl
              bg-[#FFB800] text-[#0F172A] font-semibold text-sm
              hover:bg-[#F0AE00] transition-colors
            "
          >
            <Package size={16} />
            Track Package
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto px-5 pt-4">
          <ul className="space-y-1">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`
                      flex items-center gap-3 px-3 py-3 rounded-lg
                      font-medium text-sm transition-colors
                      ${isActive
                        ? "bg-[#FFB800]/10 text-[#0F172A] font-semibold"
                        : "text-[#334155] hover:bg-slate-50 hover:text-[#0F172A]"
                      }
                    `}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="my-4 border-t border-[#E2E8F0]" />

          <div className="space-y-2">
            <Link
              href="/auth/login"
              onClick={() => setMobileOpen(false)}
              className="
                flex items-center justify-center w-full py-3 rounded-xl
                border border-[#E2E8F0] text-[#0F172A] font-semibold text-sm
                hover:bg-slate-50 transition-colors
              "
            >
              Log in
            </Link>
            <Link
              href="/auth/register"
              onClick={() => setMobileOpen(false)}
              className="
                flex items-center justify-center w-full py-3 rounded-xl
                bg-[#0F172A] text-white font-semibold text-sm
                hover:bg-[#1E293B] transition-colors
              "
            >
              Get Started
            </Link>
          </div>
        </nav>

        <div className="px-5 py-4 border-t border-[#E2E8F0]">
          <p className="text-xs text-[#94A3B8] text-center">
            hello@yellowduck.io · +1 (415) 555-0192
          </p>
        </div>
      </div>
    </>
  );
}