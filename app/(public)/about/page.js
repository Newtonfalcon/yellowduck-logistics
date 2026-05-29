import Link from "next/link";
import {
  Globe,
  Shield,
  Clock,
  Users,
  Package,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Zap,
} from "lucide-react";

export const metadata = {
  title: "About",
  description: "Learn about Yellowduck Freight Systems — our mission, values, and the team powering global logistics.",
};

const STATS = [
  { value: "180+", label: "Countries Served" },
  { value: "2.4M", label: "Packages Monthly" },
  { value: "4,200+", label: "Business Clients" },
  { value: "99.97%", label: "On-Time Rate" },
];

const VALUES = [
  {
    icon: Shield,
    title: "Reliability First",
    description:
      "Every system we build is designed with redundancy at its core. When you ship with Yellowduck, you're backed by infrastructure that's been stress-tested at scale.",
  },
  {
    icon: Globe,
    title: "Global by Default",
    description:
      "We don't bolt on international capabilities — our entire platform was designed from day one to handle cross-border complexity, customs, and carrier diversity.",
  },
  {
    icon: Clock,
    title: "Real-Time Always",
    description:
      "Sub-second telemetry isn't a feature for us; it's a baseline. Your shipments update as they move, not in batches hours later.",
  },
  {
    icon: Users,
    title: "Customer Partnership",
    description:
      "We grow when you grow. Our success metrics are built around your on-time delivery rate, not just platform uptime.",
  },
];

const MILESTONES = [
  { year: "2019", event: "Yellowduck founded in Lagos with a focus on cross-border West Africa logistics." },
  { year: "2020", event: "Expanded to the UK and EU corridor, processing first 50,000 packages." },
  { year: "2021", event: "Launched real-time tracking infrastructure — sub-second updates across 40 carriers." },
  { year: "2022", event: "Reached 1M+ monthly shipments. Opened Dubai and Singapore transit hubs." },
  { year: "2023", event: "Achieved SOC 2 Type II certification. Partnered with FedEx International and DHL." },
  { year: "2024", event: "Expanded to 180+ countries, 44 owned facilities, 2.4M monthly packages." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      {/* Hero */}
      <section className="relative pt-28 pb-20 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            backgroundImage: `
              radial-gradient(circle at 15% 50%, rgba(255,184,0,0.08) 0%, transparent 50%),
              radial-gradient(circle at 85% 30%, rgba(15,23,42,0.04) 0%, transparent 50%)
            `,
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFB800]/12 border border-[#FFB800]/25 mb-6">
              <Zap size={13} className="text-[#FFB800]" />
              <span className="text-xs font-semibold text-[#92670A] tracking-wide">Our Story</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0F172A] leading-[1.1] tracking-tight">
              Built by shippers,{" "}
              <span className="text-[#FFB800]">for shippers.</span>
            </h1>
            <p className="mt-6 text-lg text-[#475569] leading-relaxed max-w-2xl">
              Yellowduck was born from the frustration of opaque tracking, unpredictable customs, and logistics platforms that stopped working when routes crossed borders. We set out to build the infrastructure we always wished existed.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/auth/register"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#FFB800] text-[#0F172A] font-semibold text-sm hover:bg-[#F0AE00] transition-all shadow-sm"
              >
                Start Shipping
                <ArrowRight size={15} />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-[#E2E8F0] bg-white text-[#334155] font-semibold text-sm hover:bg-[#F8FAFC] transition-all"
              >
                Talk to Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-[#E2E8F0] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">{stat.value}</p>
                <p className="mt-1 text-sm text-[#64748B] font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight leading-tight">
                Our mission: make global shipping as simple as local delivery.
              </h2>
              <p className="mt-5 text-base text-[#64748B] leading-relaxed">
                International logistics should not require a specialist degree. We've abstracted away the complexity of customs classification, carrier selection, and regulatory compliance — so your team can focus on growth, not paperwork.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "Automated customs documentation generation",
                  "Multi-carrier route optimization",
                  "Real-time proactive exception alerting",
                  "Transparent, zone-based pricing — no surprises",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-[#22C55E] flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-[#334155]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-[#0F172A] rounded-3xl p-8 space-y-5">
              <div className="inline-flex items-center gap-2 bg-[#FFB800]/15 border border-[#FFB800]/25 px-3 py-1.5 rounded-full">
                <TrendingUp size={12} className="text-[#FFB800]" />
                <span className="text-xs font-semibold text-[#FFB800]">Growth Metrics</span>
              </div>
              <p className="text-2xl font-extrabold text-white leading-tight">
                Shipping volume grew 340% from 2021 to 2024.
              </p>
              <p className="text-sm text-[#64748B] leading-relaxed">
                That growth is fueled entirely by customer referrals. No paid acquisition — just a platform that works so well, businesses recommend it.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="bg-[#1E293B] rounded-xl p-4">
                  <p className="text-xs text-[#94A3B8] uppercase tracking-wide">NPS Score</p>
                  <p className="text-2xl font-extrabold text-[#FFB800] mt-1">72</p>
                </div>
                <div className="bg-[#1E293B] rounded-xl p-4">
                  <p className="text-xs text-[#94A3B8] uppercase tracking-wide">Retention</p>
                  <p className="text-2xl font-extrabold text-[#FFB800] mt-1">94%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white border-y border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
              What we stand for
            </h2>
            <p className="mt-3 text-base text-[#64748B] max-w-xl mx-auto">
              These aren't posters on a wall. They're the principles that shape every product decision we make.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {VALUES.map((value) => {
              const Icon = value.icon;
              return (
                <div key={value.title} className="flex gap-5 p-6 rounded-2xl border border-[#E2E8F0] hover:shadow-md transition-all">
                  <div className="w-11 h-11 rounded-xl bg-[#FFF8E6] flex items-center justify-center flex-shrink-0">
                    <Icon size={20} className="text-[#FFB800]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#0F172A]">{value.title}</h3>
                    <p className="mt-2 text-sm text-[#64748B] leading-relaxed">{value.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 lg:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
              How we got here
            </h2>
          </div>
          <div className="space-y-0">
            {MILESTONES.map((milestone, i) => (
              <div key={milestone.year} className="flex gap-6">
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-[#FFB800] flex items-center justify-center text-[#0F172A] text-xs font-extrabold">
                    {milestone.year.slice(2)}
                  </div>
                  {i < MILESTONES.length - 1 && (
                    <div className="w-px flex-1 bg-[#E2E8F0] my-2" />
                  )}
                </div>
                <div className="pb-8 flex-1">
                  <p className="text-xs font-bold text-[#FFB800] uppercase tracking-widest mb-1">{milestone.year}</p>
                  <p className="text-sm text-[#334155] leading-relaxed">{milestone.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#0F172A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Package size={32} className="text-[#FFB800] mx-auto mb-4" />
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Ready to ship smarter?
          </h2>
          <p className="mt-3 text-[#64748B] max-w-xl mx-auto">
            Join 4,200+ businesses that have made the switch to modern logistics.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#FFB800] text-[#0F172A] font-bold text-sm hover:bg-[#F0AE00] transition-all"
            >
              Get Started Free
              <ArrowRight size={15} />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-[#334155] text-[#94A3B8] font-semibold text-sm hover:border-[#475569] hover:text-white transition-all"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}