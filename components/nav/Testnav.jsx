"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight, Package, ChevronRight } from "lucide-react";
import { PUBLIC_NAV_LINKS, PUBLIC_NAV_AUTH } from "@/constants";

export default function Testnav() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // 1. Handle Scroll Effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 2. Lock Scroll when Mobile Menu is Open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  // 3. Close menu on navigation
  useEffect(() => setIsOpen(false), [pathname]);

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-[100] transition-all duration-300 ${
          scrolled || isOpen
            ? "bg-white border-b border-slate-200 py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 z-[110]">
              <div className="bg-[#FFB800] p-1.5 rounded-lg">
                <Package size={20} className="text-[#0F172A]" />
              </div>
              <span className="font-bold text-xl tracking-tight text-[#0F172A]">
                Yellowduck
              </span>
            </Link>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-8">
              {PUBLIC_NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-slate-600 hover:text-[#FFB800] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Desktop Auth */}
            <div className="hidden md:flex items-center gap-3">
              <Link href={PUBLIC_NAV_AUTH.login.href} className="px-4 py-2 text-sm font-semibold text-slate-700">
                {PUBLIC_NAV_AUTH.login.label}
              </Link>
              <Link 
                href={PUBLIC_NAV_AUTH.signup.href} 
                className="bg-[#0F172A] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-800 transition-all flex items-center gap-2"
              >
                {PUBLIC_NAV_AUTH.signup.label}
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-slate-900 z-[110]"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <div 
          className={`fixed inset-0 bg-white z-[100] md:hidden transition-transform duration-500 ease-in-out ${
            isOpen ? "translate-y-0" : "-translate-y-full"
          }`}
          style={{ top: "0" }}
        >
          <div className="flex flex-col h-full pt-24 pb-10 px-6">
            <div className="flex flex-col gap-1">
              {PUBLIC_NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center justify-between py-5 border-b border-slate-50 text-2xl font-bold text-[#0F172A] active:text-[#FFB800]"
                >
                  {link.label}
                  <ChevronRight size={20} className="text-slate-300" />
                </Link>
              ))}
            </div>

            <div className="mt-auto flex flex-col gap-4">
              <Link 
                href={PUBLIC_NAV_AUTH.login.href} 
                className="w-full py-4 text-center text-lg font-semibold text-slate-600 border border-slate-200 rounded-2xl"
              >
                {PUBLIC_NAV_AUTH.login.label}
              </Link>
              <Link 
                href={PUBLIC_NAV_AUTH.signup.href} 
                className="w-full py-4 text-center text-lg font-bold bg-[#FFB800] text-[#0F172A] rounded-2xl shadow-lg shadow-amber-200"
              >
                {PUBLIC_NAV_AUTH.signup.label}
              </Link>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Important: Spacer to prevent hero text from hiding under the fixed nav */}
      <div className="h-[72px] md:h-[88px]" />
    </>
  );
}