"use client";

import Sidebar from "@/components/nav/Sidebar";
import Topbar from "@/app/dashboard/components/Navbar";
import { MessageCircle } from "lucide-react";

export default function HelpPage() {
  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar title="Help" subtitle="Get support from the admin team" />

        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#FFB800]/15 flex items-center justify-center mx-auto">
              <MessageCircle size={26} className="text-[#FFB800]" />
            </div>
            <h2 className="text-xl font-extrabold text-[#0F172A]">Need Help?</h2>
            <p className="text-sm text-[#64748B] max-w-xs">
              Reach out to the admin team and we'll get back to you as soon as possible.
            </p>
            <a
              href="mailto:hello@yellowduck.io"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#FFB800] text-[#0F172A] text-sm font-bold hover:bg-[#F0AE00] active:scale-[0.98] transition-all shadow-sm"
            >
              <MessageCircle size={15} />
              Message Admin
            </a>
          </div>
        </main>
      </div>
    </div>
  );
}