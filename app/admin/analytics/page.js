"use client";

import Sidebar from "@/components/nav/Sidebar";
import Topbar from "@/app/dashboard/components/Navbar";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Clock,
  Truck,
  Package,
  AlertTriangle,
  CheckCircle2,
  Target,
  Award,
  Calendar,
  Filter,
  Download,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

// ─── Mock Data ─────────────────────────────────────────────────────────────────
const ANALYTICS_SUMMARY = [
  { label: "Avg Delivery Time", value: "4.2d", icon: Clock, color: "bg-blue-50 text-blue-600", change: "-0.3d", trend: "down" },
  { label: "Customs Clearance", value: "18.5h", icon: Target, color: "bg-amber-50 text-amber-600", change: "+2.1h", trend: "up" },
  { label: "On-Time Rate", value: "99.3%", icon: CheckCircle2, color: "bg-green-50 text-green-600", change: "+0.2%", trend: "down" },
  { label: "Exception Rate", value: "0.8%", icon: AlertTriangle, color: "bg-red-50 text-red-600", change: "-0.1%", trend: "down" },
];

const KEY_METRICS = [
  {
    id: 1,
    category: "Delivery Performance",
    metrics: [
      { label: "Average Delivery Time", value: "4.2 days", benchmark: "4.5 days", status: "above" },
      { label: "On-Time Delivery Rate", value: "99.3%", benchmark: "98.0%", status: "above" },
      { label: "Same-Day Delivery %", value: "12.4%", benchmark: "10.0%", status: "above" },
      { label: "Delayed Shipments", value: "28", benchmark: "< 50", status: "above" },
    ],
  },
  {
    id: 2,
    category: "Customs & Compliance",
    metrics: [
      { label: "Avg Customs Clearance", value: "18.5 hours", benchmark: "24 hours", status: "above" },
      { label: "Customs Clearance Rate", value: "96.8%", benchmark: "95.0%", status: "above" },
      { label: "Active Customs Holds", value: "63", benchmark: "< 100", status: "above" },
      { label: "Documentation Errors", value: "2.1%", benchmark: "3.0%", status: "above" },
    ],
  },
  {
    id: 3,
    category: "Facility Operations",
    metrics: [
      { label: "Avg Facility Throughput", value: "76.2%", benchmark: "70%", status: "above" },
      { label: "Peak Hour Capacity", value: "94%", benchmark: "85%", status: "warning" },
      { label: "Facility Availability", value: "95.5%", benchmark: "99.0%", status: "below" },
      { label: "Processing Time (hrs)", value: "12.3", benchmark: "14.0", status: "above" },
    ],
  },
  {
    id: 4,
    category: "Carrier Performance",
    metrics: [
      { label: "Yellowduck Aviation", value: "98.1%", benchmark: "95%", status: "above" },
      { label: "FedEx Partnership", value: "97.2%", benchmark: "95%", status: "above" },
      { label: "DHL Partnership", value: "96.4%", benchmark: "95%", status: "above" },
      { label: "Regional Carriers", value: "94.8%", benchmark: "90%", status: "above" },
    ],
  },
];

const DELAY_BREAKDOWN = [
  { reason: "Customs Hold",         count: 185, percentage: 28, color: "bg-amber-400" },
  { reason: "Weather Delay",        count: 142, percentage: 21, color: "bg-blue-400" },
  { reason: "Facility Congestion",  count: 124, percentage: 19, color: "bg-orange-400" },
  { reason: "Address Issue",        count: 98,  percentage: 15, color: "bg-purple-400" },
  { reason: "Misroute/Reroute",     count: 81,  percentage: 12, color: "bg-red-400" },
  { reason: "Damage/Rework",        count: 41,  percentage: 5,  color: "bg-pink-400" },
];

const CARRIER_PERFORMANCE = [
  { name: "Yellowduck Aviation", on_time: 98.1, delivered: 12403, delays: 237, rating: "A+" },
  { name: "FedEx International", on_time: 97.2, delivered: 8104, delays: 230, rating: "A+" },
  { name: "DHL Express", on_time: 96.4, delivered: 6512, delays: 248, rating: "A" },
  { name: "UPS Worldwide", on_time: 95.8, delivered: 5234, delays: 220, rating: "A" },
  { name: "Emirates SkyCargo", on_time: 94.2, delivered: 3412, delays: 202, rating: "A-" },
  { name: "Lufthansa Cargo", on_time: 93.6, delivered: 2814, delays: 178, rating: "A-" },
];

const TIME_PERIOD_DATA = [
  { period: "May 17-23", deliveries: 14281, on_time: 99.3, exceptions: 28, customs_avg: 18.5 },
  { period: "May 10-16", deliveries: 13904, on_time: 99.1, exceptions: 31, customs_avg: 19.2 },
  { period: "May 3-9", deliveries: 14156, on_time: 98.9, exceptions: 35, customs_avg: 20.1 },
  { period: "Apr 26-May 2", deliveries: 13742, on_time: 99.0, exceptions: 33, customs_avg: 19.8 },
];

const STATUS_COLORS = {
  above: "text-green-600 bg-green-50",
  below: "text-red-600 bg-red-50",
  warning: "text-amber-600 bg-amber-50",
};

// ─── Metric Card ──────────────────────────────────────────────────────────────
function SummaryCard({ label, value, icon: Icon, color, change, trend }) {
  const TrendIcon = trend === "down" ? TrendingDown : TrendingUp;
  const trendColor = trend === "down" ? "text-green-600" : "text-red-600";

  return (
    <div className="bg-white rounded-lg border border-[#E2E8F0] p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-[#64748B] font-medium">{label}</p>
          <p className="text-3xl font-bold text-[#0F172A] mt-2">{value}</p>
          <div className={`flex items-center gap-1 mt-2 ${trendColor}`}>
            <TrendIcon size={16} />
            <span className="text-xs font-semibold">{change}</span>
          </div>
        </div>
        <div className={`${color} p-3 rounded-lg`}>
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}

// ─── Metric Item ──────────────────────────────────────────────────────────────
function MetricItem({ label, value, benchmark, status }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-[#E2E8F0] last:border-0">
      <div className="flex-1">
        <p className="text-sm font-medium text-[#0F172A]">{label}</p>
        <p className="text-xs text-[#94A3B8] mt-1">Benchmark: {benchmark}</p>
      </div>
      <div className={`px-3 py-1 rounded-lg text-sm font-bold ${STATUS_COLORS[status]}`}>
        {value}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("week");

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      <Sidebar isAdmin />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />

        <div className="flex-1 overflow-auto">
          <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-[#0F172A]">Analytics & Reporting</h1>
                <p className="text-[#64748B] mt-1">Avg delivery time • Customs clearance • Facility throughput • Delay analysis</p>
              </div>
              <div className="flex gap-2">
                {["day", "week", "month"].map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      timeRange === range
                        ? "bg-[#FFB800] text-[#0F172A]"
                        : "bg-white border border-[#E2E8F0] text-[#334155] hover:bg-[#F8FAFC]"
                    }`}
                  >
                    {range.charAt(0).toUpperCase() + range.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {ANALYTICS_SUMMARY.map((card, idx) => (
                <SummaryCard key={idx} {...card} />
              ))}
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {KEY_METRICS.map((section) => (
                <div key={section.id} className="bg-white rounded-lg border border-[#E2E8F0] overflow-hidden">
                  <div className="bg-[#F8FAFC] px-6 py-4 border-b border-[#E2E8F0]">
                    <h3 className="font-bold text-[#0F172A]">{section.category}</h3>
                  </div>
                  <div className="divide-y divide-[#E2E8F0]">
                    {section.metrics.map((metric, idx) => (
                      <MetricItem
                        key={idx}
                        label={metric.label}
                        value={metric.value}
                        benchmark={metric.benchmark}
                        status={metric.status}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Delay Breakdown */}
            <div className="bg-white rounded-lg border border-[#E2E8F0] p-6 mb-8">
              <h3 className="font-bold text-[#0F172A] mb-6">Shipment Delays Breakdown</h3>
              <div className="space-y-4">
                {DELAY_BREAKDOWN.map((item, idx) => (
                  <div key={idx}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${item.color}`} />
                        <span className="text-sm font-medium text-[#0F172A]">{item.reason}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-[#0F172A]">{item.count}</p>
                        <p className="text-xs text-[#94A3B8]">{item.percentage}%</p>
                      </div>
                    </div>
                    <div className="w-full bg-[#F1F5F9] rounded-full h-2 overflow-hidden">
                      <div className={`h-full rounded-full ${item.color} transition-all`} style={{ width: `${item.percentage}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Carrier Performance */}
            <div className="bg-white rounded-lg border border-[#E2E8F0] mb-8 overflow-hidden">
              <div className="px-6 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
                <h3 className="font-bold text-[#0F172A]">Carrier Performance Ranking</h3>
              </div>
              <table className="w-full">
                <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                  <tr className="text-xs uppercase text-[#64748B] font-semibold">
                    <th className="px-6 py-4 text-left">Carrier</th>
                    <th className="px-6 py-4 text-left">On-Time Rate</th>
                    <th className="px-6 py-4 text-left">Delivered</th>
                    <th className="px-6 py-4 text-left">Delays</th>
                    <th className="px-6 py-4 text-left">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {CARRIER_PERFORMANCE.map((carrier, idx) => (
                    <tr key={idx} className="border-b border-[#E2E8F0] hover:bg-[#F8FAFC]">
                      <td className="px-6 py-4 font-medium text-[#0F172A]">{carrier.name}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-[#F1F5F9] rounded-full h-2 w-20">
                            <div
                              className="h-full rounded-full bg-green-400"
                              style={{ width: `${carrier.on_time}%` }}
                            />
                          </div>
                          <span className="text-sm font-bold text-[#0F172A] w-12">{carrier.on_time}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#334155]">{carrier.delivered.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm text-[#64748B]">{carrier.delays}</td>
                      <td className="px-6 py-4 text-sm font-bold text-[#0F172A] bg-blue-50 px-3 py-1 rounded inline-block">{carrier.rating}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Weekly Trend */}
            <div className="bg-white rounded-lg border border-[#E2E8F0] overflow-hidden">
              <div className="px-6 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
                <h3 className="font-bold text-[#0F172A]">Weekly Trend Analysis</h3>
              </div>
              <table className="w-full">
                <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                  <tr className="text-xs uppercase text-[#64748B] font-semibold">
                    <th className="px-6 py-4 text-left">Period</th>
                    <th className="px-6 py-4 text-left">Deliveries</th>
                    <th className="px-6 py-4 text-left">On-Time Rate</th>
                    <th className="px-6 py-4 text-left">Exceptions</th>
                    <th className="px-6 py-4 text-left">Customs Avg</th>
                  </tr>
                </thead>
                <tbody>
                  {TIME_PERIOD_DATA.map((data, idx) => (
                    <tr key={idx} className="border-b border-[#E2E8F0] hover:bg-[#F8FAFC]">
                      <td className="px-6 py-4 font-medium text-[#0F172A]">{data.period}</td>
                      <td className="px-6 py-4 text-sm text-[#334155]">{data.deliveries.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className="inline-block px-3 py-1 rounded-full text-sm font-bold bg-green-50 text-green-600">
                          {data.on_time}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-[#0F172A]">{data.exceptions}</td>
                      <td className="px-6 py-4 text-sm text-[#334155]">{data.customs_avg}h</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
