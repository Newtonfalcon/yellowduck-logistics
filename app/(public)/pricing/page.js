import Link from "next/link";
import {
  Check,
  ArrowRight,
  Zap,
  Shield,
  Globe,
  HelpCircle,
  Package,
  Building2,
} from "lucide-react";

export const metadata = {
  title: "Pricing",
  description: "Simple, transparent pricing for Yellowduck's global logistics platform. No hidden fees.",
};

const PLANS = [
  {
    name: "Starter",
    description: "For individuals and small businesses just getting started.",
    price: "Free",
    priceSub: "Forever",
    cta: "Get Started",
    href: "/auth/register",
    accent: false,
    features: [
      "Up to 50 shipments/month",
      "Real-time tracking dashboard",
      "Standard international shipping",
      "Email notifications",
      "Public tracking pages",
      "Basic customs documentation",
    ],
    notIncluded: [
      "Priority support",
      "API access",
      "Batch shipment creation",
      "Custom webhooks",
    ],
  },
  {
    name: "Business",
    description: "For growing teams shipping at volume across borders.",
    price: "$149",
    priceSub: "per month",
    cta: "Start Business Trial",
    href: "/auth/register",
    accent: true,
    badge: "Most Popular",
    features: [
      "Unlimited shipments",
      "Priority customs clearance",
      "Full API access + SDKs",
      "Webhook integrations",
      "Batch shipment creation",
      "Dedicated account manager",
      "SMS + email notifications",
      "Advanced analytics dashboard",
      "Multi-user team access",
    ],
    notIncluded: [],
  },
  {
    name: "Enterprise",
    description: "For large-scale operations needing custom infrastructure.",
    price: "Custom",
    priceSub: "Contact sales",
    cta: "Talk to Sales",
    href: "/contact",
    accent: false,
    features: [
      "Everything in Business",
      "Negotiated carrier rates",
      "SLA guarantees",
      "Dedicated infrastructure",
      "Custom integrations",
      "On-site onboarding",
      "24/7 premium support",
      "Custom reporting",
      "Multi-org management",
    ],
    notIncluded: [],
  },
];

const SHIPPING_RATES = [
  { service: "Economy International", eta: "10–14 business days", perKg: "$2.80", base: "$9.00" },
  { service: "Standard International", eta: "5–7 business days", perKg: "$6.00", base: "$18.00" },
  { service: "Express International", eta: "2–3 business days", perKg: "$12.50", base: "$35.00" },
];

const FAQS = [
  {
    q: "How are shipping rates calculated?",
    a: "Rates are based on chargeable weight — the higher of actual weight or volumetric weight — plus your destination country's applicable duties. All fees are shown before you confirm.",
  },
  {
    q: "Are there contracts or lock-in periods?",
    a: "No. All plans are month-to-month. Upgrade, downgrade, or cancel at any time from your dashboard settings.",
  },
  {
    q: "What currencies do you accept?",
    a: "We bill in USD. Shipment duty estimates are shown in USD at current exchange rates.",
  },
  {
    q: "Is the free plan really free?",
    a: "Yes. The Starter plan costs nothing. You pay only the per-shipment shipping cost. No monthly fee, no credit card required to sign up.",
  },
  {
    q: "How does insurance work?",
    a: "You can add shipment insurance at checkout for $8.00 per shipment, covering up to $1,000 in declared value. For higher-value goods, contact our sales team for custom coverage.",
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      {/* Hero */}
      <section className="pt-28 pb-16 text-center relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            backgroundImage: `
              radial-gradient(circle at 50% 0%, rgba(255,184,0,0.08) 0%, transparent 60%)
            `,
          }}
        />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFB800]/12 border border-[#FFB800]/25 mb-6">
            <Zap size={13} className="text-[#FFB800]" />
            <span className="text-xs font-semibold text-[#92670A] tracking-wide">Simple Pricing</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0F172A] tracking-tight leading-tight">
            Transparent pricing,<br />no surprises.
          </h1>
          <p className="mt-5 text-lg text-[#475569] leading-relaxed">
            Start free. Pay only for what you ship. Scale when you're ready.
          </p>
        </div>
      </section>

      {/* Plans */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`
                  relative rounded-2xl border p-8 flex flex-col
                  ${plan.accent
                    ? "bg-[#0F172A] border-[#0F172A] shadow-xl shadow-[#0F172A]/20"
                    : "bg-white border-[#E2E8F0]"
                  }
                `}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-[#FFB800] text-[#0F172A] text-xs font-bold px-3 py-1 rounded-full">
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl mb-4 ${plan.accent ? "bg-[#FFB800]/20" : "bg-[#F1F5F9]"}`}>
                    {plan.name === "Starter" ? <Package size={18} className={plan.accent ? "text-[#FFB800]" : "text-[#64748B]"} /> : plan.name === "Enterprise" ? <Building2 size={18} className="text-[#64748B]" /> : <Zap size={18} className={plan.accent ? "text-[#FFB800]" : "text-[#64748B]"} />}
                  </div>
                  <h3 className={`text-lg font-bold ${plan.accent ? "text-white" : "text-[#0F172A]"}`}>{plan.name}</h3>
                  <p className={`text-sm mt-1 ${plan.accent ? "text-[#64748B]" : "text-[#64748B]"}`}>{plan.description}</p>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className={`text-4xl font-extrabold ${plan.accent ? "text-[#FFB800]" : "text-[#0F172A]"}`}>
                      {plan.price}
                    </span>
                    {plan.price !== "Custom" && (
                      <span className={`text-sm ${plan.accent ? "text-[#64748B]" : "text-[#94A3B8]"}`}>
                        /{plan.priceSub}
                      </span>
                    )}
                  </div>
                  {plan.price === "Custom" && (
                    <p className={`text-sm mt-1 ${plan.accent ? "text-[#64748B]" : "text-[#94A3B8]"}`}>{plan.priceSub}</p>
                  )}
                </div>

                <Link
                  href={plan.href}
                  className={`
                    flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold mb-8 transition-all
                    ${plan.accent
                      ? "bg-[#FFB800] text-[#0F172A] hover:bg-[#F0AE00]"
                      : "bg-[#0F172A] text-white hover:bg-[#1E293B]"
                    }
                  `}
                >
                  {plan.cta}
                  <ArrowRight size={14} />
                </Link>

                <ul className="space-y-3 flex-1">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2.5">
                      <Check size={15} className={`flex-shrink-0 mt-0.5 ${plan.accent ? "text-[#22C55E]" : "text-[#22C55E]"}`} />
                      <span className={`text-sm ${plan.accent ? "text-[#CBD5E1]" : "text-[#334155]"}`}>{feat}</span>
                    </li>
                  ))}
                  {plan.notIncluded.map((feat) => (
                    <li key={feat} className="flex items-start gap-2.5 opacity-40">
                      <div className={`w-3.5 h-3.5 flex items-center justify-center flex-shrink-0 mt-0.5`}>
                        <div className="w-3 h-px bg-current" />
                      </div>
                      <span className={`text-sm ${plan.accent ? "text-[#64748B]" : "text-[#94A3B8]"}`}>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Per-shipment rates */}
      <section className="py-16 bg-white border-y border-[#E2E8F0]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
              Per-shipment rates
            </h2>
            <p className="mt-2 text-[#64748B] text-sm">
              Rates shown are base price + per-kg charges, before fuel surcharge and duties.
            </p>
          </div>
          <div className="overflow-hidden rounded-2xl border border-[#E2E8F0]">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                  <th className="px-6 py-4 text-left text-xs font-bold text-[#94A3B8] uppercase tracking-widest">Service</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-[#94A3B8] uppercase tracking-widest">ETA</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-[#94A3B8] uppercase tracking-widest">Base Price</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-[#94A3B8] uppercase tracking-widest">Per Kg</th>
                </tr>
              </thead>
              <tbody>
                {SHIPPING_RATES.map((rate, i) => (
                  <tr key={rate.service} className={`border-b border-[#E2E8F0] last:border-0 ${i === 1 ? "bg-[#FFF8E6]" : ""}`}>
                    <td className="px-6 py-4 font-semibold text-[#0F172A]">
                      {rate.service}
                      {i === 2 && <span className="ml-2 text-[10px] bg-[#FFB800] text-[#0F172A] px-1.5 py-0.5 rounded-full font-bold">Fastest</span>}
                    </td>
                    <td className="px-6 py-4 text-[#64748B]">{rate.eta}</td>
                    <td className="px-6 py-4 font-medium text-[#0F172A]">{rate.base}</td>
                    <td className="px-6 py-4 font-medium text-[#0F172A]">{rate.perKg}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs text-[#94A3B8] text-center">
            A 5–6% fuel surcharge applies. Estimated duties are calculated at checkout based on declared value and destination.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 lg:py-28">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
              Frequently asked questions
            </h2>
          </div>
          <div className="space-y-4">
            {FAQS.map((faq) => (
              <div key={faq.q} className="bg-white rounded-2xl border border-[#E2E8F0] p-6">
                <div className="flex items-start gap-3">
                  <HelpCircle size={18} className="text-[#FFB800] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-[#0F172A] text-sm">{faq.q}</p>
                    <p className="mt-2 text-sm text-[#64748B] leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#0F172A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            No credit card required to get started.
          </h2>
          <p className="mt-3 text-[#64748B]">Start shipping internationally in under 5 minutes.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#FFB800] text-[#0F172A] font-bold text-sm hover:bg-[#F0AE00] transition-all"
            >
              Create Free Account
              <ArrowRight size={15} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-[#334155] text-[#94A3B8] font-semibold text-sm hover:border-[#475569] hover:text-white transition-all"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}