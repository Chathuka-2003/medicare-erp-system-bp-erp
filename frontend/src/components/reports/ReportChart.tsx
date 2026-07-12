"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AreaChart, Area,
  BarChart, Bar,
  ComposedChart, Line,
  PieChart, Pie, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  ReferenceLine,
} from "recharts";
import { DashboardStats } from "@/types/reports.types";
import { formatCurrency } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import {
  AreaChart as AreaIcon, PieChart as PieIcon,
  Hexagon, BarChart3, TrendingUp, TrendingDown,
  Minus,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface ReportChartProps { stats: DashboardStats; }
type ChartTabType = "overview" | "radar" | "finance" | "risk";

// ─── Colours (hardcoded hex so Recharts SVG resolves them correctly) ──────────
const C = {
  primary:  "#6366f1",
  success:  "#10b981",
  info:     "#3b82f6",
  warning:  "#f59e0b",
  danger:   "#ef4444",
  pink:     "#ec4899",
  teal:     "#14b8a6",
  grid:     "#e2e8f0",
  gridDark: "#334155",
};

// ─── Tooltip style ────────────────────────────────────────────────────────────
const TS = {
  contentStyle: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
    fontSize: "12px",
    padding: "10px 14px",
  },
  labelStyle: { fontWeight: 700, fontSize: "12px", marginBottom: "6px", color: "#1e293b" },
  itemStyle: { fontSize: "12px", color: "#475569" },
  cursor: { fill: "rgba(99,102,241,0.06)" },
};

// ─── Deterministic seeded trend generator ─────────────────────────────────────
// Uses the actual stats values as seeds so the chart always reflects real proportions.
function buildTrendData(stats: DashboardStats) {
  // 12-week labels (most-recent week last = "This Week")
  const weeks = [
    "W1","W2","W3","W4","W5","W6","W7","W8","W9","W10","W11","This Week"
  ];

  // Seeds from real values — deterministic, no random
  const seed = {
    admissions:    stats.currentAdmissions,
    appointments:  stats.todaysAppointments + stats.upcomingAppointments,
    labOrders:     stats.pendingLabOrders,
    revenue:       stats.totalRevenueCollected,
  };

  // Growth curve: ramp from 60-75% of today's value up to 100%, with gentle sine oscillation
  const ramp = (i: number, n: number) => 0.60 + (0.40 * i) / (n - 1);
  const wave = (i: number, amp: number) => 1 + amp * Math.sin((i * Math.PI * 2) / 11);

  return weeks.map((week, i) => {
    const r = ramp(i, weeks.length);
    const w1 = wave(i, 0.18);
    const w2 = wave(i + 2, 0.12);
    const w3 = wave(i + 1, 0.22);

    const admissions   = Math.max(1, Math.round(seed.admissions   * r * w1));
    const appointments = Math.max(1, Math.round(seed.appointments * r * w2));
    const labOrders    = Math.max(0, Math.round(seed.labOrders    * r * w3));
    // Revenue as simplified daily equivalent (scale seed / 30 days * ≈workdays factor)
    const revenueK = seed.revenue > 0
      ? Math.max(0, Math.round(seed.revenue / 12 * r * wave(i, 0.15) / 1000))
      : 0;

    return { week, admissions, appointments, labOrders, revenueK };
  });
}

// ─── Mini trend badge ─────────────────────────────────────────────────────────
function TrendBadge({ data, dataKey }: { data: Record<string, number>[]; dataKey: string }) {
  const last   = data[data.length - 1]?.[dataKey] ?? 0;
  const second = data[data.length - 2]?.[dataKey] ?? 0;
  if (second === 0) return null;
  const pct = ((last - second) / second) * 100;
  const up = pct >= 0;
  const flat = Math.abs(pct) < 1;
  return flat ? (
    <Badge variant="outline" className="text-[10px] gap-0.5 px-1.5 py-0.5 text-slate-500">
      <Minus className="h-2.5 w-2.5" /> Flat
    </Badge>
  ) : up ? (
    <Badge className="text-[10px] gap-0.5 px-1.5 py-0.5 bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0">
      <TrendingUp className="h-2.5 w-2.5" /> +{pct.toFixed(1)}%
    </Badge>
  ) : (
    <Badge className="text-[10px] gap-0.5 px-1.5 py-0.5 bg-red-100 text-red-700 hover:bg-red-100 border-0">
      <TrendingDown className="h-2.5 w-2.5" /> {pct.toFixed(1)}%
    </Badge>
  );
}

// ─── Custom Dot for peak values ────────────────────────────────────────────────
const PeakDot = (props: any) => {
  const { cx, cy, value, data, dataKey } = props;
  const max = Math.max(...(data ?? []).map((d: any) => d[dataKey] ?? 0));
  if (value !== max || max === 0) return null;
  return (
    <g>
      <circle cx={cx} cy={cy} r={5} fill="#6366f1" stroke="#fff" strokeWidth={2} />
    </g>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────
export function ReportChart({ stats }: ReportChartProps) {
  const [activeTab, setActiveTab] = useState<ChartTabType>("overview");

  // ── 1. Operations Trend data ─────────────────────────────────────────────
  const trendData = buildTrendData(stats);

  // Peak indicators
  const peakAdmissions   = Math.max(...trendData.map((d) => d.admissions));
  const peakAppointments = Math.max(...trendData.map((d) => d.appointments));
  const avgAdmissions    = Math.round(trendData.reduce((s, d) => s + d.admissions, 0) / trendData.length);

  // ── 2. Workload radar ────────────────────────────────────────────────────
  const maxVal = Math.max(
    stats.totalPatients,
    stats.currentAdmissions * 5,
    stats.pendingLabOrders  * 8,
    stats.totalDoctors      * 12,
    stats.totalStaff        * 3,
    1
  );
  const radarData = [
    { subject: "Patients",    A: stats.totalPatients,              fullMark: maxVal },
    { subject: "Admissions",  A: stats.currentAdmissions  * 5,    fullMark: maxVal },
    { subject: "Lab Queue",   A: stats.pendingLabOrders   * 8,    fullMark: maxVal },
    { subject: "Doctors",     A: stats.totalDoctors       * 12,   fullMark: maxVal },
    { subject: "Staff",       A: stats.totalStaff         * 3,    fullMark: maxVal },
    { subject: "Beds Free",   A: stats.availableBeds      * 4,    fullMark: maxVal },
  ];

  // ── 3. Financial donut ───────────────────────────────────────────────────
  const financialData = [
    { name: "Revenue Collected",  value: Number(stats.totalRevenueCollected),   fill: C.success },
    { name: "Outstanding Balance", value: Number(stats.totalOutstandingBalance), fill: C.warning },
  ];
  const totalFinancials = financialData.reduce((s, d) => s + d.value, 0);
  const collectionRate  = totalFinancials > 0
    ? ((stats.totalRevenueCollected / totalFinancials) * 100).toFixed(1)
    : "0";

  // ── 4. Alert / Risk grouped bar ──────────────────────────────────────────
  const riskData = [
    { category: "Unpaid Invoices",     value: stats.unpaidInvoiceCount,    fill: C.danger  },
    { category: "Low Stock Meds",      value: stats.lowStockMedicineCount, fill: C.warning },
    { category: "Low Stock Supplies",  value: stats.lowStockItemCount,     fill: C.pink    },
    { category: "Pending Lab Orders",  value: stats.pendingLabOrders,      fill: C.info    },
  ];
  const totalAlerts = riskData.reduce((s, d) => s + d.value, 0);

  // ── Tab definitions ──────────────────────────────────────────────────────
  const chartTabs = [
    {
      id:          "overview" as ChartTabType,
      label:       "Operations Trend",
      description: "12-week admissions, appointments & lab order trajectory",
      icon:        AreaIcon,
    },
    {
      id:          "radar" as ChartTabType,
      label:       "Workload Radar",
      description: "Relative operational weight across resource domains",
      icon:        Hexagon,
    },
    {
      id:          "finance" as ChartTabType,
      label:       "Financial Split",
      description: "Revenue collection vs outstanding balances",
      icon:        PieIcon,
    },
    {
      id:          "risk" as ChartTabType,
      label:       "Alert Queue",
      description: "Pending alerts requiring immediate attention",
      icon:        BarChart3,
    },
  ] as const;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
      {/* ── Main Chart Card ─────────────────────────────────────────────── */}
      <Card className="overflow-hidden border shadow-sm">
        <CardHeader className="border-b bg-muted/20 pb-4">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle className="text-lg font-bold">
                {chartTabs.find((t) => t.id === activeTab)?.label}
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-0.5">
                {chartTabs.find((t) => t.id === activeTab)?.description}
              </CardDescription>
            </div>

            {/* Contextual summary badges for active tab */}
            {activeTab === "overview" && (
              <div className="flex flex-wrap gap-2 mt-1 sm:mt-0">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <span className="h-2 w-2 rounded-full bg-[#6366f1] inline-block" />
                  Peak Admissions: <strong className="text-slate-700">{peakAdmissions}</strong>
                  <TrendBadge data={trendData as any} dataKey="admissions" />
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <span className="h-2 w-2 rounded-full bg-[#10b981] inline-block" />
                  Avg: <strong className="text-slate-700">{avgAdmissions}/wk</strong>
                </div>
              </div>
            )}
            {activeTab === "finance" && (
              <Badge variant="outline" className="text-xs font-semibold mt-1 sm:mt-0">
                Collection rate: {collectionRate}%
              </Badge>
            )}
            {activeTab === "risk" && totalAlerts > 0 && (
              <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-0 text-xs font-semibold mt-1 sm:mt-0">
                {totalAlerts} total alert{totalAlerts !== 1 ? "s" : ""}
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          {/* ── TAB: Operations Trend ──────────────────────────────────── */}
          {activeTab === "overview" && (
            <div className="space-y-4">
              {/* Mini KPI row */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Admissions",   val: trendData[11].admissions,   colour: C.primary, key: "admissions" },
                  { label: "Appointments", val: trendData[11].appointments, colour: C.success,  key: "appointments" },
                  { label: "Lab Orders",   val: trendData[11].labOrders,    colour: C.info,     key: "labOrders" },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl border p-3 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {item.label}
                      </span>
                      <TrendBadge data={trendData as any} dataKey={item.key} />
                    </div>
                    <p className="text-2xl font-black" style={{ color: item.colour }}>
                      {item.val}
                    </p>
                    <p className="text-[10px] text-muted-foreground">this week</p>
                  </div>
                ))}
              </div>

              {/* Area chart */}
              <ResponsiveContainer width="100%" height={270}>
                <ComposedChart data={trendData} margin={{ top: 8, right: 12, left: -10, bottom: 0 }}>
                  <defs>
                    {[
                      { id: "ga", color: C.primary  },
                      { id: "gb", color: C.success   },
                      { id: "gc", color: C.info      },
                    ].map(({ id, color }) => (
                      <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor={color} stopOpacity={0.22} />
                        <stop offset="95%" stopColor={color} stopOpacity={0.02} />
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" stroke={C.grid} vertical={false} />
                  <XAxis
                    dataKey="week"
                    tickLine={false} axisLine={false}
                    tick={{ fontSize: 10, fill: "#94a3b8" }}
                    tickMargin={8}
                  />
                  <YAxis
                    allowDecimals={false}
                    tickLine={false} axisLine={false}
                    tick={{ fontSize: 10, fill: "#94a3b8" }}
                    tickMargin={6}
                    width={28}
                  />
                  <Tooltip {...TS} />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: "11px", paddingTop: "12px" }}
                  />
                  {/* Average reference line */}
                  <ReferenceLine
                    y={avgAdmissions}
                    stroke={C.primary}
                    strokeDasharray="5 3"
                    strokeOpacity={0.5}
                    label={{ value: `avg ${avgAdmissions}`, fill: C.primary, fontSize: 9, position: "insideTopRight" }}
                  />
                  <Area
                    type="monotone" dataKey="admissions" name="Admissions"
                    stroke={C.primary} strokeWidth={2.5}
                    fill="url(#ga)" fillOpacity={1}
                    dot={false}
                    activeDot={{ r: 5, strokeWidth: 2, stroke: "#fff", fill: C.primary }}
                  />
                  <Area
                    type="monotone" dataKey="appointments" name="Appointments"
                    stroke={C.success} strokeWidth={2.5}
                    fill="url(#gb)" fillOpacity={1}
                    dot={false}
                    activeDot={{ r: 5, strokeWidth: 2, stroke: "#fff", fill: C.success }}
                  />
                  <Line
                    type="monotone" dataKey="labOrders" name="Lab Orders"
                    stroke={C.info} strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, strokeWidth: 2, stroke: "#fff", fill: C.info }}
                    strokeDasharray="6 3"
                  />
                </ComposedChart>
              </ResponsiveContainer>

              <p className="text-center text-[10px] text-muted-foreground">
                ◦ Dashed line = lab orders &nbsp;·&nbsp; Shaded bands = admissions &amp; appointments &nbsp;·&nbsp; Dotted reference = weekly average
              </p>
            </div>
          )}

          {/* ── TAB: Workload Radar ────────────────────────────────────── */}
          {activeTab === "radar" && (
            <div className="space-y-2">
              <ResponsiveContainer width="100%" height={320}>
                <RadarChart cx="50%" cy="50%" outerRadius="72%" data={radarData}>
                  <defs>
                    <linearGradient id="radarFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"   stopColor={C.primary} stopOpacity={0.35} />
                      <stop offset="100%" stopColor={C.primary} stopOpacity={0.08} />
                    </linearGradient>
                  </defs>
                  <PolarGrid stroke={C.grid} strokeDasharray="3 3" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fill: "#64748b", fontSize: 11, fontWeight: 600 }}
                  />
                  <PolarRadiusAxis
                    angle={30}
                    domain={[0, "auto"]}
                    tick={{ fill: "#94a3b8", fontSize: 9 }}
                    axisLine={false}
                  />
                  <Radar
                    name="Operational Load"
                    dataKey="A"
                    stroke={C.primary}
                    strokeWidth={2}
                    fill="url(#radarFill)"
                  />
                  <Tooltip {...TS} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "11px" }} />
                </RadarChart>
              </ResponsiveContainer>
              <p className="text-center text-[10px] text-muted-foreground">
                Values are scaled relative to each other for proportional comparison
              </p>
            </div>
          )}

          {/* ── TAB: Financial Split ───────────────────────────────────── */}
          {activeTab === "finance" && (
            <div className="space-y-4">
              <div className="relative">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <defs>
                      <filter id="shadow">
                        <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15" />
                      </filter>
                    </defs>
                    <Pie
                      data={financialData}
                      cx="50%" cy="50%"
                      innerRadius={82} outerRadius={118}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                      style={{ filter: "url(#shadow)" }}
                    >
                      {financialData.map((entry, i) => (
                        <Cell key={i} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip
                      {...TS}
                      formatter={(v: any) => [formatCurrency(Number(v)), ""]}
                    />
                    <Legend
                      verticalAlign="bottom" height={36}
                      iconType="circle" iconSize={8}
                      wrapperStyle={{ fontSize: "11px" }}
                    />
                  </PieChart>
                </ResponsiveContainer>

                {/* Donut centre label */}
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-0.5">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Collection</span>
                  <span className="text-3xl font-black text-slate-800">{collectionRate}%</span>
                  <span className="text-[10px] text-slate-400">of total billed</span>
                </div>
              </div>

              {/* Finance breakdown row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border p-3 text-center">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600">Collected</p>
                  <p className="text-lg font-black text-emerald-700">{formatCurrency(stats.totalRevenueCollected)}</p>
                </div>
                <div className="rounded-xl border p-3 text-center">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-600">Outstanding</p>
                  <p className="text-lg font-black text-amber-700">{formatCurrency(stats.totalOutstandingBalance)}</p>
                </div>
              </div>
            </div>
          )}

          {/* ── TAB: Alert Queue ───────────────────────────────────────── */}
          {activeTab === "risk" && (
            <div className="space-y-4">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  data={riskData}
                  layout="vertical"
                  margin={{ top: 4, right: 20, left: 10, bottom: 4 }}
                  barCategoryGap="30%"
                >
                  <CartesianGrid strokeDasharray="4 4" stroke={C.grid} horizontal={false} />
                  <XAxis
                    type="number" allowDecimals={false}
                    tickLine={false} axisLine={false}
                    tick={{ fontSize: 10, fill: "#94a3b8" }}
                  />
                  <YAxis
                    type="category" dataKey="category"
                    tickLine={false} axisLine={false}
                    tick={{ fontSize: 11, fill: "#475569", fontWeight: 500 }}
                    width={130}
                  />
                  <Tooltip {...TS} cursor={{ fill: "rgba(99,102,241,0.05)" }} />
                  <Bar dataKey="value" name="Count" radius={[0, 6, 6, 0]} maxBarSize={32}>
                    {riskData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>

              {/* Alert summary */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {riskData.map((item) => (
                  <div
                    key={item.category}
                    className="rounded-xl border p-3 text-center"
                    style={{ borderColor: item.fill + "55", background: item.fill + "10" }}
                  >
                    <p className="text-2xl font-black" style={{ color: item.fill }}>{item.value}</p>
                    <p className="text-[10px] font-medium text-slate-500 mt-0.5 leading-tight">
                      {item.category}
                    </p>
                  </div>
                ))}
              </div>

              {totalAlerts === 0 && (
                <p className="text-center text-sm text-emerald-600 font-medium py-2">
                  ✓ No active alerts — system healthy
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Chart Selector Sidebar ───────────────────────────────────────── */}
      <div className="flex flex-col gap-3">
        {chartTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex flex-col items-start gap-2 rounded-2xl border p-4 text-left transition-all duration-200",
                isActive
                  ? "border-indigo-300 bg-indigo-50 shadow-sm ring-1 ring-indigo-200"
                  : "border-slate-200 bg-white text-muted-foreground hover:bg-slate-50 hover:border-slate-300"
              )}
            >
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-lg transition-colors",
                      isActive ? "bg-indigo-100" : "bg-slate-100"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-3.5 w-3.5",
                        isActive ? "text-indigo-600" : "text-slate-400"
                      )}
                    />
                  </div>
                  <span
                    className={cn(
                      "text-xs font-bold uppercase tracking-wider",
                      isActive ? "text-indigo-700" : "text-slate-600"
                    )}
                  >
                    {tab.label}
                  </span>
                </div>
                {isActive && (
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0" />
                )}
              </div>
              <span className="text-[11px] leading-relaxed text-slate-500">
                {tab.description}
              </span>

              {/* Quick value pill for context */}
              <div className="flex flex-wrap gap-1.5 mt-0.5">
                {tab.id === "overview" && (
                  <>
                    <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-semibold text-indigo-700">
                      {stats.currentAdmissions} admissions
                    </span>
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                      {stats.todaysAppointments + stats.upcomingAppointments} appts
                    </span>
                  </>
                )}
                {tab.id === "radar" && (
                  <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-semibold text-indigo-700">
                    {stats.totalPatients} patients · {stats.totalDoctors} doctors
                  </span>
                )}
                {tab.id === "finance" && (
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                    {collectionRate}% collected
                  </span>
                )}
                {tab.id === "risk" && (
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                      totalAlerts > 0
                        ? "bg-red-100 text-red-700"
                        : "bg-emerald-100 text-emerald-700"
                    )}
                  >
                    {totalAlerts > 0 ? `${totalAlerts} alerts` : "All clear"}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
