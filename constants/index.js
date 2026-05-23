import {
  Package,
  MapPin,
  Shield,
  Globe,
  Clock,
  BarChart3,
  FileText,
  PlusCircle,
  LayoutDashboard,
  Settings,
  Users,
  CreditCard,
  HelpCircle,
  Bell,
  Truck,
} from "lucide-react";
import {
  Twitter,
  Linkedin,
  Github,
  Facebook,
  Mail,
  Phone,
  ChevronRight,
} from "@/components/icons/CustomIcons";

// ─── Public Navigation ────────────────────────────────────────────────────────
export const PUBLIC_NAV_LINKS = [
  { label: "Solutions", href: "/solutions" },
  { label: "Pricing", href: "/pricing" },
  { label: "Enterprise", href: "/enterprise" },
  { label: "Developers", href: "/developers" },
  { label: "Blog", href: "/blog" },
];

export const PUBLIC_NAV_CTA = {
  label: "Track Package",
  href: "/track",
};

export const PUBLIC_NAV_AUTH = {
  login: { label: "Log in", href: "/login" },
  signup: { label: "Get Started", href: "/signup" },
};

// ─── Dashboard Sidebar Navigation ────────────────────────────────────────────
export const SIDEBAR_MAIN_LINKS = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
    badge: null,
  },
  {
    label: "Shipments",
    href: "/dashboard/shipments",
    icon: Package,
    badge: "12",
  },
  {
    label: "Create Shipment",
    href: "/dashboard/create",
    icon: PlusCircle,
    badge: null,
  },
  {
    label: "Tracking",
    href: "/dashboard/tracking",
    icon: MapPin,
    badge: null,
  },
  {
    label: "Invoices",
    href: "/dashboard/invoices",
    icon: FileText,
    badge: "3",
  },
  {
    label: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
    badge: null,
  },
  {
    label: "Fleet",
    href: "/dashboard/fleet",
    icon: Truck,
    badge: null,
  },
];

export const SIDEBAR_SECONDARY_LINKS = [
  {
    label: "Notifications",
    href: "/dashboard/notifications",
    icon: Bell,
    badge: "5",
  },
  {
    label: "Team",
    href: "/dashboard/team",
    icon: Users,
    badge: null,
  },
  {
    label: "Billing",
    href: "/dashboard/billing",
    icon: CreditCard,
    badge: null,
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    badge: null,
  },
  {
    label: "Help",
    href: "/dashboard/help",
    icon: HelpCircle,
    badge: null,
  },
];

// Admin-only section
export const SIDEBAR_ADMIN_LINKS = [
  {
    label: "Admin Panel",
    href: "/admin",
    icon: Shield,
    badge: null,
  },
  {
    label: "All Users",
    href: "/admin/users",
    icon: Users,
    badge: null,
  },
];

// ─── Hero Section ─────────────────────────────────────────────────────────────
export const HERO = {
  eyebrow: "Logistics Redefined",
  headline: "Ship Anything, Anywhere,\nWith Confidence.",
  subheadline:
    "Yellowduck powers the world's fastest-growing brands with end-to-end logistics intelligence — real-time tracking, automated customs, and transparent pricing.",
  tracking_placeholder: "Enter tracking number (e.g. YD-0042-AMBER)",
  tracking_cta: "Track Now",
  stats: [
    { value: "180+", label: "Countries covered" },
    { value: "2.4M", label: "Packages monthly" },
    { value: "99.97%", label: "On-time delivery" },
    { value: "< 1s", label: "Tracking latency" },
  ],
};

// ─── Trust / Features Section ─────────────────────────────────────────────────
export const FEATURES_SECTION = {
  eyebrow: "Why Yellowduck",
  headline: "Built for reliability at global scale.",
  subheadline:
    "Every feature is engineered around one promise: your shipment arrives, on time, every time.",
};

export const FEATURES = [
  {
    id: "global-reach",
    icon: Globe,
    title: "Global Reach",
    description:
      "Ship to 180+ countries with a single integration. Our carrier network spans every major logistics provider — FedEx, DHL, UPS, and 300+ regional carriers.",
    tags: ["180+ Countries", "300+ Carriers"],
  },
  {
    id: "real-time-tracking",
    icon: Clock,
    title: "Real-Time Tracking",
    description:
      "Sub-second package status updates powered by our proprietary telemetry layer. Get push notifications, webhooks, and an embeddable tracking widget.",
    tags: ["< 1s Latency", "Webhooks"],
  },
  {
    id: "secure-handling",
    icon: Shield,
    title: "Secure Handling",
    description:
      "End-to-end encryption, tamper-evident seals, and SOC 2 Type II compliance. We treat every shipment like it's irreplaceable — because to your customer, it is.",
    tags: ["SOC 2 Type II", "E2E Encryption"],
  },
];

// ─── Social Proof / Logos ─────────────────────────────────────────────────────
export const TRUSTED_BY = {
  headline: "Trusted by teams at",
  companies: [
    "Acme Corp",
    "Vercel",
    "Notion",
    "Linear",
    "Stripe",
    "Shopify",
  ],
};

// ─── CTA Banner ───────────────────────────────────────────────────────────────
export const CTA_BANNER = {
  headline: "Ready to modernize your logistics?",
  subheadline: "Join 4,200+ businesses shipping smarter with Yellowduck.",
  primary: { label: "Start for Free", href: "/signup" },
  secondary: { label: "Talk to Sales", href: "/contact" },
};

// ─── Footer ───────────────────────────────────────────────────────────────────
export const FOOTER_COLUMNS = [
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Careers", href: "/careers", badge: "Hiring" },
      { label: "Press", href: "/press" },
      { label: "Blog", href: "/blog" },
      { label: "Investors", href: "/investors" },
    ],
  },
  {
    heading: "Services",
    links: [
      { label: "Express Shipping", href: "/services/express" },
      { label: "Freight & Cargo", href: "/services/freight" },
      { label: "Customs Clearance", href: "/services/customs" },
      { label: "Warehousing", href: "/services/warehousing" },
      { label: "Returns Management", href: "/services/returns" },
    ],
  },
  {
    heading: "Support",
    links: [
      { label: "Documentation", href: "/docs" },
      { label: "API Reference", href: "/api" },
      { label: "Status Page", href: "/status" },
      { label: "Help Center", href: "/help" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
];

export const FOOTER_SOCIALS = [
  { label: "Twitter", href: "https://twitter.com/yellowduck", icon: Twitter },
  { label: "LinkedIn", href: "https://linkedin.com/company/yellowduck", icon: Linkedin },
  { label: "GitHub", href: "https://github.com/yellowduck", icon: Github },
  { label: "Facebook", href: "https://facebook.com/yellowduck", icon: Facebook },
];

export const FOOTER_CONTACT = [
  { label: "hello@yellowduck.io", icon: Mail, href: "mailto:hello@yellowduck.io" },
  { label: "+1 (415) 555-0192", icon: Phone, href: "tel:+14155550192" },
];

export const FOOTER_LEGAL = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Cookie Settings", href: "/cookies" },
  { label: "GDPR", href: "/gdpr" },
];

export const FOOTER_META = {
  tagline: "Delivering trust, one package at a time.",
  copyright: `© ${new Date().getFullYear()} Yellowduck Logistics, Inc. All rights reserved.`,
};