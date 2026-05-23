"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "../Logo";
import {
  SIDEBAR_MAIN_LINKS,
  SIDEBAR_SECONDARY_LINKS,
  SIDEBAR_ADMIN_LINKS,
} from "@/constants";
import {
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  LogOut,
} from "lucide-react";

// ─── Nav Item (shared between sidebar states) ─────────────────────────────────
function NavItem({ link, collapsed, pathname, onClick }) {
  const Icon = link.icon;
  const isActive =
    pathname === link.href ||
    (link.href !== "/dashboard" && pathname.startsWith(link.href));

  return (
    <li>
      <Link
        href={link.href}
        onClick={onClick}
        title={collapsed ? link.label : undefined}
        className={`
          group flex items-center gap-3 rounded-xl px-3 py-2.5
          text-sm font-medium transition-all duration-150 relative
          ${isActive
            ? "bg-[#FFB800] text-[#0F172A] shadow-sm"
            : "text-[#94A3B8] hover:bg-[#1E293B] hover:text-white"
          }
          ${collapsed ? "justify-center px-0 w-10 mx-auto" : ""}
        `}
      >
        <Icon
          size={18}
          className={`flex-shrink-0 transition-colors ${
            isActive ? "text-[#0F172A]" : "text-[#64748B] group-hover:text-white"
          }`}
        />

        {/* Label (hidden when collapsed) */}
        {!collapsed && (
          <span className="flex-1 truncate">{link.label}</span>
        )}

        {/* Badge */}
        {!collapsed && link.badge && (
          <span
            className={`
              text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center leading-none
              ${isActive
                ? "bg-[#0F172A]/15 text-[#0F172A]"
                : "bg-[#FFB800]/20 text-[#FFB800]"
              }
            `}
          >
            {link.badge}
          </span>
        )}

        {/* Collapsed badge dot */}
        {collapsed && link.badge && (
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#FFB800]" />
        )}
      </Link>
    </li>
  );
}

// ─── Section Label ────────────────────────────────────────────────────────────
function SectionLabel({ label, collapsed }) {
  if (collapsed) return <div className="my-1 border-t border-[#1E293B]" />;
  return (
    <p className="px-3 pt-5 pb-1.5 text-[10px] font-semibold tracking-widest uppercase text-[#475569]">
      {label}
    </p>
  );
}

// ─── Sidebar Component ────────────────────────────────────────────────────────
export default function Sidebar({ isAdmin = false }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const sidebarContent = (isMobile = false) => (
    <aside
      className={`
        flex flex-col h-full bg-[#0F172A]
        ${!isMobile ? (collapsed ? "w-[68px]" : "w-[240px]") : "w-[280px]"}
        transition-[width] duration-200 ease-in-out
      `}
    >
      {/* ── Logo / Header ─────────────────────────────────────── */}
      <div
        className={`
          flex items-center h-16 border-b border-[#1E293B] flex-shrink-0
          ${collapsed && !isMobile ? "justify-center px-0" : "px-4"}
        `}
      >
        {collapsed && !isMobile ? (
          <Logo variant="mark" size="sm" />
        ) : (
          <div className="flex items-center justify-between w-full">
            <Logo size="sm" theme="light" />
            {isMobile && (
              <button
                className="p-1.5 rounded-lg text-[#64748B] hover:text-white hover:bg-[#1E293B] transition-colors"
                onClick={() => setMobileOpen(false)}
                aria-label="Close sidebar"
              >
                <X size={18} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── Navigation ────────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-2 space-y-0.5">

        {/* Main nav */}
        <SectionLabel label="Main" collapsed={collapsed && !isMobile} />
        <ul className="space-y-0.5">
          {SIDEBAR_MAIN_LINKS.map((link) => (
            <NavItem
              key={link.href}
              link={link}
              collapsed={collapsed && !isMobile}
              pathname={pathname}
            />
          ))}
        </ul>

        {/* Secondary nav */}
        <SectionLabel label="Account" collapsed={collapsed && !isMobile} />
        <ul className="space-y-0.5">
          {SIDEBAR_SECONDARY_LINKS.map((link) => (
            <NavItem
              key={link.href}
              link={link}
              collapsed={collapsed && !isMobile}
              pathname={pathname}
            />
          ))}
        </ul>

        {/* Admin section */}
        {isAdmin && (
          <>
            <SectionLabel label="Admin" collapsed={collapsed && !isMobile} />
            <ul className="space-y-0.5">
              {SIDEBAR_ADMIN_LINKS.map((link) => (
                <NavItem
                  key={link.href}
                  link={link}
                  collapsed={collapsed && !isMobile}
                  pathname={pathname}
                />
              ))}
            </ul>
          </>
        )}
      </nav>

      {/* ── Footer / Collapse Toggle ──────────────────────────── */}
      <div className="flex-shrink-0 border-t border-[#1E293B] p-2 space-y-1">

        {/* User snippet */}
        {!(collapsed && !isMobile) && (
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-[#1E293B] transition-colors cursor-pointer group">
            <div className="w-8 h-8 rounded-full bg-[#FFB800] flex items-center justify-center text-[#0F172A] font-bold text-xs flex-shrink-0">
              JD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">Jane Doe</p>
              <p className="text-[10px] text-[#64748B] truncate">jane@acme.com</p>
            </div>
            <LogOut
              size={14}
              className="text-[#475569] group-hover:text-[#94A3B8] flex-shrink-0 transition-colors"
            />
          </div>
        )}

        {/* Collapse toggle (desktop only) */}
        {!isMobile && (
          <button
            onClick={() => setCollapsed((v) => !v)}
            className={`
              flex items-center gap-2 w-full px-3 py-2 rounded-xl
              text-[#475569] hover:text-white hover:bg-[#1E293B]
              text-xs font-medium transition-colors
              ${collapsed ? "justify-center" : ""}
            `}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight size={15} />
            ) : (
              <>
                <ChevronLeft size={15} />
                <span>Collapse</span>
              </>
            )}
          </button>
        )}
      </div>
    </aside>
  );

  return (
    <>
      {/* ── Desktop Sidebar (fixed, left) ─────────────────────────────────── */}
      <div
        className={`
          hidden lg:flex flex-col fixed top-0 left-0 bottom-0 z-30
          transition-[width] duration-200
          ${collapsed ? "w-[68px]" : "w-[240px]"}
        `}
      >
        {sidebarContent(false)}
      </div>

      {/* ── Desktop spacer so main content is not under sidebar ─────────── */}
      <div
        className={`
          hidden lg:block flex-shrink-0 transition-[width] duration-200
          ${collapsed ? "w-[68px]" : "w-[240px]"}
        `}
        aria-hidden="true"
      />

      {/* ── Mobile Hamburger Trigger ───────────────────────────────────────── */}
      <button
        className="
          lg:hidden fixed top-4 left-4 z-50
          p-2 rounded-xl bg-[#0F172A] text-white shadow-lg
          hover:bg-[#1E293B] transition-colors
        "
        onClick={() => setMobileOpen(true)}
        aria-label="Open navigation"
        aria-expanded={mobileOpen}
      >
        <Menu size={20} />
      </button>

      {/* ── Mobile Backdrop ────────────────────────────────────────────────── */}
      <div
        className={`
          lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm
          transition-opacity duration-300
          ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      {/* ── Mobile Drawer ──────────────────────────────────────────────────── */}
      <div
        className={`
          lg:hidden fixed top-0 left-0 bottom-0 z-50
          flex transition-transform duration-300 ease-out
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        role="dialog"
        aria-label="Navigation"
      >
        {sidebarContent(true)}
      </div>
    </>
  );
}