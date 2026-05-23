"use client";

import { useState } from "react";
import { Bell, Search, ChevronDown, Plus, Package } from "lucide-react";
import Link from "next/link";

export default function Topbar({ title, subtitle }) {
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-[#E2E8F0] flex items-center px-4 sm:px-6 gap-4 flex-shrink-0">

      {/* Left: Title (shown on md+) */}
      <div className="hidden md:flex flex-col min-w-0 flex-shrink-0">
        {title && (
          <h1 className="text-base font-bold text-[#0F172A] leading-none truncate">{title}</h1>
        )}
        {subtitle && (
          <p className="text-xs text-[#94A3B8] mt-0.5 leading-none truncate">{subtitle}</p>
        )}
      </div>

      {/* Center: Search */}
      <div className={`flex-1 max-w-md ${title ? "md:ml-6" : ""}`}>
        <div className="relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search shipments, invoices…"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className={`
              w-full pl-9 pr-4 py-2 rounded-xl text-sm
              bg-[#F8FAFC] border transition-all
              text-[#0F172A] placeholder:text-[#94A3B8]
              focus:outline-none focus:bg-white
              ${searchFocused ? "border-[#FFB800] shadow-sm" : "border-[#E2E8F0]"}
            `}
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[#CBD5E1] font-mono hidden sm:block">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 flex-shrink-0 ml-auto">

        {/* Quick create */}
        <Link
          href="/dashboard/create"
          className="
            hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl
            bg-[#FFB800] text-[#0F172A] text-xs font-bold
            hover:bg-[#F0AE00] active:scale-[0.98] transition-all
          "
        >
          <Plus size={14} />
          New Shipment
        </Link>

        {/* Notifications */}
        <button className="relative p-2 rounded-xl text-[#64748B] hover:bg-[#F1F5F9] transition-colors">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FFB800] border-2 border-white" />
        </button>

        {/* User avatar */}
        <button className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-[#F1F5F9] transition-colors">
          <div className="w-7 h-7 rounded-full bg-[#FFB800] flex items-center justify-center text-[#0F172A] text-[11px] font-bold flex-shrink-0">
            JD
          </div>
          <span className="hidden sm:block text-sm font-medium text-[#0F172A]">Jane</span>
          <ChevronDown size={13} className="text-[#94A3B8] hidden sm:block" />
        </button>
      </div>
    </header>
  );
}