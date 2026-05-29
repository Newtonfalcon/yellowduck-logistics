"use client";

import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Clock,
  Globe,
} from "lucide-react";

const OFFICES = [
  { city: "Lagos", country: "Nigeria", address: "15 Victoria Island Blvd, Lagos Island", phone: "+234 812 000 0001", flag: "🇳🇬" },
  { city: "London", country: "United Kingdom", address: "100 Liverpool Street, London EC2M 2AT", phone: "+44 20 7946 0001", flag: "🇬🇧" },
  { city: "Dubai", country: "UAE", address: "DIFC Gate Building, Level 5, Dubai", phone: "+971 4 000 0001", flag: "🇦🇪" },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const set = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSending(true);
    // Simulate network request
    await new Promise((r) => setTimeout(r, 1200));
    setSending(false);
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      {/* Hero */}
      <section className="pt-28 pb-16 text-center relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 0%, rgba(255,184,0,0.07) 0%, transparent 60%)`,
          }}
        />
        <div className="relative max-w-2xl mx-auto px-4 sm:px-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFB800]/12 border border-[#FFB800]/25 mb-6">
            <MessageSquare size={13} className="text-[#FFB800]" />
            <span className="text-xs font-semibold text-[#92670A] tracking-wide">Get In Touch</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0F172A] tracking-tight leading-tight">
            We&apos;d love to hear from you.
          </h1>
          <p className="mt-5 text-lg text-[#475569] leading-relaxed">
            Whether you&apos;re a new customer, an existing partner, or just curious — our team is ready to help.
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-10">

          {/* Left — contact info */}
          <div className="lg:col-span-2 space-y-6">

            {/* Quick contact */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 space-y-4">
              <h3 className="font-bold text-[#0F172A]">Direct Contact</h3>
              <a href="mailto:hello@yellowduck.io" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-[#FFF8E6] flex items-center justify-center flex-shrink-0">
                  <Mail size={17} className="text-[#FFB800]" />
                </div>
                <div>
                  <p className="text-xs text-[#94A3B8] font-medium uppercase tracking-wide">Email</p>
                  <p className="text-sm font-semibold text-[#0F172A] group-hover:text-[#FFB800] transition-colors">hello@yellowduck.io</p>
                </div>
              </a>
              <a href="tel:+14155550192" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-[#FFF8E6] flex items-center justify-center flex-shrink-0">
                  <Phone size={17} className="text-[#FFB800]" />
                </div>
                <div>
                  <p className="text-xs text-[#94A3B8] font-medium uppercase tracking-wide">Phone</p>
                  <p className="text-sm font-semibold text-[#0F172A] group-hover:text-[#FFB800] transition-colors">+1 (415) 555-0192</p>
                </div>
              </a>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FFF8E6] flex items-center justify-center flex-shrink-0">
                  <Clock size={17} className="text-[#FFB800]" />
                </div>
                <div>
                  <p className="text-xs text-[#94A3B8] font-medium uppercase tracking-wide">Support Hours</p>
                  <p className="text-sm font-semibold text-[#0F172A]">24/7 for Business & Enterprise</p>
                </div>
              </div>
            </div>

            {/* Offices */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 space-y-4">
              <h3 className="font-bold text-[#0F172A]">Our Offices</h3>
              {OFFICES.map((office) => (
                <div key={office.city} className="flex items-start gap-3">
                  <span className="text-xl flex-shrink-0">{office.flag}</span>
                  <div>
                    <p className="text-sm font-semibold text-[#0F172A]">{office.city}, {office.country}</p>
                    <p className="text-xs text-[#64748B] mt-0.5">{office.address}</p>
                    <p className="text-xs text-[#94A3B8] mt-0.5">{office.phone}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Response time */}
            <div className="bg-[#0F172A] rounded-2xl p-6">
              <Globe size={20} className="text-[#FFB800] mb-3" />
              <p className="text-sm font-bold text-white">Typical response time</p>
              <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                General inquiries: under 4 hours. Support tickets: under 1 hour for Business and Enterprise plans.
              </p>
            </div>
          </div>

          {/* Right — form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-8 shadow-sm">
              <h2 className="text-xl font-extrabold text-[#0F172A] mb-6">Send us a message</h2>

              {sent ? (
                <div className="flex flex-col items-center text-center py-10 gap-4">
                  <div className="w-16 h-16 rounded-full bg-green-50 border-4 border-green-100 flex items-center justify-center">
                    <CheckCircle2 size={32} className="text-green-500" />
                  </div>
                  <h3 className="text-xl font-bold text-[#0F172A]">Message sent!</h3>
                  <p className="text-sm text-[#64748B] max-w-xs leading-relaxed">
                    Thanks for reaching out. We'll get back to you at <strong>{form.email}</strong> shortly.
                  </p>
                  <button
                    onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                    className="mt-2 text-sm font-semibold text-[#FFB800] hover:text-[#F0AE00] transition-colors"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#334155] mb-1.5">
                        Full Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Jane Doe"
                        value={form.name}
                        onChange={set("name")}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] text-sm text-[#0F172A] placeholder:text-[#CBD5E1] bg-[#F8FAFC] focus:bg-white focus:outline-none focus:border-[#FFB800] focus:ring-2 focus:ring-[#FFB800]/20 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#334155] mb-1.5">
                        Email Address <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="email"
                        placeholder="you@company.com"
                        value={form.email}
                        onChange={set("email")}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] text-sm text-[#0F172A] placeholder:text-[#CBD5E1] bg-[#F8FAFC] focus:bg-white focus:outline-none focus:border-[#FFB800] focus:ring-2 focus:ring-[#FFB800]/20 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#334155] mb-1.5">Subject</label>
                    <select
                      value={form.subject}
                      onChange={set("subject")}
                      className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] text-sm text-[#0F172A] bg-[#F8FAFC] focus:bg-white focus:outline-none focus:border-[#FFB800] focus:ring-2 focus:ring-[#FFB800]/20 transition-all appearance-none"
                    >
                      <option value="">Select a topic…</option>
                      <option value="sales">Sales inquiry</option>
                      <option value="support">Technical support</option>
                      <option value="billing">Billing question</option>
                      <option value="partnership">Partnership</option>
                      <option value="press">Press & media</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#334155] mb-1.5">
                      Message <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      rows={5}
                      placeholder="Tell us how we can help…"
                      value={form.message}
                      onChange={set("message")}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] text-sm text-[#0F172A] placeholder:text-[#CBD5E1] bg-[#F8FAFC] focus:bg-white focus:outline-none focus:border-[#FFB800] focus:ring-2 focus:ring-[#FFB800]/20 transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={sending}
                    className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-[#FFB800] text-[#0F172A] font-bold text-sm hover:bg-[#F0AE00] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-sm"
                  >
                    {sending ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Sending…
                      </>
                    ) : (
                      <>
                        Send Message
                        <ArrowRight size={15} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}