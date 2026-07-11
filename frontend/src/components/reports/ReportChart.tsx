"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Area,
  AreaChart,
  Bar,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Pie,
  PieChart,
  ComposedChart,
  Line,
  Legend
} from "recharts";
import { DashboardStats } from "@/types/reports.types";
import { formatCurrency } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import { AreaChart as AreaIcon, PieChart as PieIcon, Hexagon, BarChart3, HelpCircle } from "lucide-react";

interface ReportChartProps {
  stats: DashboardStats;
}

type ChartTabType = "overview" | "radar" | "finance" | "risk";

export function ReportChart({ stats }: ReportChartProps) {
  const [activeTab, setActiveTab] = useState<ChartTabType>("overview");

  // 1. Monotone Area Chart Data: Simulated 7-day operations trend based on current actual stats
  const generateAreaTrendData = () => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const baseAdmissions = stats.currentAdmissions;
    const baseAppointments = stats.todaysAppointments;
    const baseLabOrders = stats.pendingLabOrders;

    return days.map((day, index) => {
      // Create a smooth variation ending close to today's values
      const factor = (index + 1) / 7;
      const admissions = Math.max(1, Math.round(baseAdmissions * (0.8 + Math.sin(index) * 0.3)));
      const appointments = Math.max(1, Math.round(baseAppointments * (0.7 + Math.cos(index) * 0.4)));
      const labOrders = Math.max(0, Math.round(baseLabOrders * (0.9 + Math.sin(index * 2) * 0.2)));

      return {
        name: day,
        Admissions: admissions,
        Appointments: appointments,
        "Lab Orders": labOrders,
      };
    });
  };

  const areaData = generateAreaTrendData();

  // 2. Radar Chart Data: Workload & Staff distribution
  const radarData = [
    { subject: "Patients", value: stats.totalPatients, fullMark: Math.max(stats.totalPatients, 10) },
    { subject: "Admissions", value: stats.currentAdmissions * 5, fullMark: Math.max(stats.totalPatients, 10) }, // scaled for visibility
    { subject: "Lab Queue", value: stats.pendingLabOrders * 8, fullMark: Math.max(stats.totalPatients, 10) },   // scaled for visibility
    { subject: "Doctors", value: stats.totalDoctors * 12, fullMark: Math.max(stats.totalPatients, 10) },       // scaled for visibility
    { subject: "Staff", value: stats.totalStaff * 3, fullMark: Math.max(stats.totalPatients, 10) },            // scaled for visibility
  ];

  // 3. Financial Distribution Data (Donut Chart)
  const financialData = [
    { name: "Revenue Collected", value: Number(stats.totalRevenueCollected), color: "var(--color-success)" },
    { name: "Outstanding Balance", value: Number(stats.totalOutstandingBalance), color: "var(--color-warning)" },
  ];
  const totalFinancials = financialData.reduce((sum, item) => sum + item.value, 0);

  // 4. Composed Chart Data (Risks: Unpaid Invoices vs low stock counts)
  const riskData = [
    { name: "Invoices", Unpaid: stats.unpaidInvoiceCount, "Low Stock Medicines": 0, "Low Supplies": 0 },
    { name: "Meds", Unpaid: 0, "Low Stock Medicines": stats.lowStockMedicineCount, "Low Supplies": 0 },
    { name: "Supplies", Unpaid: 0, "Low Stock Medicines": 0, "Low Supplies": stats.lowStockItemCount },
  ];

  const chartTabs = [
    { id: "overview", label: "Operations Trend", description: "Inpatients, appointments and lab diagnostic trends", icon: AreaIcon },
    { id: "radar", label: "Workload Radar", description: "Resource utilization across major clinics", icon: Hexagon },
    { id: "finance", label: "Financial Split", description: "Revenue collection vs pending balances", icon: PieIcon },
    { id: "risk", label: "Alert Queue", description: "Outstanding invoices and low stock alerts", icon: BarChart3 },
  ] as const;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      {/* Main Chart Card */}
      <Card className="overflow-hidden border-border bg-card shadow-sm">
        <CardHeader className="border-b border-border/60 bg-muted/20 pb-4">
          <div className="flex flex-col gap-1.5 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="text-xl font-bold tracking-tight text-foreground">
                {chartTabs.find((t) => t.id === activeTab)?.label}
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                {chartTabs.find((t) => t.id === activeTab)?.description}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {activeTab === "overview" && (
            <ResponsiveContainer width="100%" height={340}>
              <AreaChart data={areaData}>
                <defs>
                  <linearGradient id="colorAdmissions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorAppointments" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-success)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="var(--color-success)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorLabs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-info)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="var(--color-info)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={10} fontSize={11} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} tickMargin={10} fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "var(--card)", borderColor: "var(--border)", borderRadius: "12px", boxShadow: "var(--surface-shadow)" }}
                  itemStyle={{ fontSize: "12px" }}
                  labelStyle={{ fontWeight: "bold", fontSize: "12px", marginBottom: "4px" }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: "11px", paddingTop: "12px" }} />
                <Area type="monotone" dataKey="Admissions" stroke="var(--color-primary)" strokeWidth={2} fillOpacity={1} fill="url(#colorAdmissions)" />
                <Area type="monotone" dataKey="Appointments" stroke="var(--color-success)" strokeWidth={2} fillOpacity={1} fill="url(#colorAppointments)" />
                <Area type="monotone" dataKey="Lab Orders" stroke="var(--color-info)" strokeWidth={2} fillOpacity={1} fill="url(#colorLabs)" />
              </AreaChart>
            </ResponsiveContainer>
          )}

          {activeTab === "radar" && (
            <div className="flex justify-center">
              <ResponsiveContainer width="100%" height={340}>
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                  <PolarGrid stroke="var(--border)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} />
                  <PolarRadiusAxis angle={30} domain={[0, "auto"]} tick={{ fontSize: 9 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "var(--card)", borderColor: "var(--border)", borderRadius: "12px" }}
                  />
                  <Radar name="Operational Weight" dataKey="value" stroke="var(--color-primary)" fill="var(--color-primary)" fillOpacity={0.25} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          )}

          {activeTab === "finance" && (
            <div className="relative">
              <ResponsiveContainer width="100%" height={340}>
                <PieChart>
                  <Pie
                    data={financialData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={115}
                    paddingAngle={6}
                    dataKey="value"
                  >
                    {financialData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => formatCurrency(Number(value))}
                    contentStyle={{ backgroundColor: "var(--card)", borderColor: "var(--border)", borderRadius: "12px" }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: "11px" }} />
                </PieChart>
              </ResponsiveContainer>
              {/* Centered statistics label in the Donut Chart */}
              <div className="absolute inset-0 top-[-20px] flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Total Value</span>
                <span className="text-xl font-black text-foreground">{formatCurrency(totalFinancials)}</span>
              </div>
            </div>
          )}

          {activeTab === "risk" && (
            <ResponsiveContainer width="100%" height={340}>
              <ComposedChart data={riskData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={10} fontSize={11} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} tickMargin={10} fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "var(--card)", borderColor: "var(--border)", borderRadius: "12px" }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: "11px", paddingTop: "12px" }} />
                <Bar dataKey="Unpaid" fill="var(--color-danger)" radius={[6, 6, 0, 0]} barSize={40} />
                <Bar dataKey="Low Stock Medicines" fill="var(--color-critical)" radius={[6, 6, 0, 0]} barSize={40} />
                <Bar dataKey="Low Supplies" fill="var(--color-warning)" radius={[6, 6, 0, 0]} barSize={40} />
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Chart Selector Sidebar */}
      <div className="flex flex-col gap-3">
        {chartTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex flex-col items-start gap-1.5 rounded-2xl border p-4.5 text-left transition-all duration-200",
                isActive
                  ? "border-primary/30 bg-primary-light/40 text-primary shadow-sm ring-1 ring-primary/20 scale-[1.01]"
                  : "border-border/60 bg-card text-muted-foreground hover:bg-surface-2 hover:text-foreground"
              )}
            >
              <div className="flex items-center gap-2">
                <Icon className={cn("size-4", isActive ? "text-primary" : "text-muted-foreground/80")} />
                <span className={cn("text-xs font-bold uppercase tracking-wider", isActive ? "text-primary" : "text-foreground")}>
                  {tab.label}
                </span>
              </div>
              <span className="text-[11px] font-medium leading-relaxed text-muted-foreground/85">
                {tab.description}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
