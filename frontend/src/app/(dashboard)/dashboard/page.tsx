"use client";

import { useDashboardStats } from "@/hooks/useReports";
import { DashboardStats } from "@/components/reports/DashboardStats";
import { ReportChart } from "@/components/reports/ReportChart";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, BedDouble, CalendarClock, DollarSign, ShieldCheck, TrendingUp, Sparkles, ArrowUpRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils/format";

interface InsightItem {
  id: string;
  type: "critical" | "warning" | "info" | "success";
  title: string;
  description: string;
}

export default function DashboardPage() {
  const { data: stats, isLoading } = useDashboardStats();
  
  const bedOccupancy = stats?.totalBeds
    ? Math.max(0, Math.min(100, Math.round(((stats.totalBeds - stats.availableBeds) / stats.totalBeds) * 100)))
    : 0;

  // Generate smart insights based on current dashboard statistics without changing API structures
  const getSmartInsights = (statsData: typeof stats): InsightItem[] => {
    if (!statsData) return [];
    
    const insights: InsightItem[] = [];

    // Bed capacity alerts
    const occupancy = statsData.totalBeds
      ? Math.round(((statsData.totalBeds - statsData.availableBeds) / statsData.totalBeds) * 100)
      : 0;
      
    if (occupancy >= 80) {
      insights.push({
        id: "bed-capacity-critical",
        type: "critical",
        title: "Critical Inpatient Census",
        description: `Bed occupancy is currently at ${occupancy}%. Coordinate with Ward management for discharge planning and capacity scheduling.`
      });
    } else if (occupancy >= 50) {
      insights.push({
        id: "bed-capacity-warning",
        type: "warning",
        title: "Moderate Bed Pressure",
        description: `Bed occupancy is at ${occupancy}% (${statsData.availableBeds} beds available). Capacity is sufficient but needs monitoring.`
      });
    } else {
      insights.push({
        id: "bed-capacity-info",
        type: "success",
        title: "Optimal Bed Capacity",
        description: `Over 50% of ward beds are available (${statsData.availableBeds} beds). Inpatient capacity is highly stable.`
      });
    }

    // Inventory alerts
    if (statsData.lowStockMedicineCount > 0 || statsData.lowStockItemCount > 0) {
      insights.push({
        id: "inventory-alert",
        type: "critical",
        title: "Critical Stock Depletion",
        description: `Stock levels are below reorder thresholds for ${statsData.lowStockMedicineCount} medicines and ${statsData.lowStockItemCount} general supplies. Immediate procurement suggested.`
      });
    }

    // Financial balance alerts
    if (statsData.totalOutstandingBalance > 0) {
      const ratio = statsData.totalRevenueCollected > 0 
        ? (statsData.totalOutstandingBalance / statsData.totalRevenueCollected) * 100 
        : 0;
      if (ratio > 20) {
        insights.push({
          id: "billing-critical",
          type: "warning",
          title: "High Outstanding Billing Ratio",
          description: `Outstanding balances ($${statsData.totalOutstandingBalance.toLocaleString()}) account for ${Math.round(ratio)}% of total collected revenue. Review pending claims.`
        });
      }
    }

    // Pending lab orders
    if (statsData.pendingLabOrders > 5) {
      insights.push({
        id: "lab-queue",
        type: "info",
        title: "High Lab Diagnostic Queue",
        description: `There are ${statsData.pendingLabOrders} lab orders pending processing. Reassign technicians to clear backlog.`
      });
    }

    return insights;
  };

  const insights = getSmartInsights(stats);

  return (
    <div className="min-h-full space-y-8 bg-background/30 p-6 md:p-8">
      {isLoading || !stats ? (
        <div className="flex h-[80vh] items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Welcome Banner Card */}
          <section className="relative overflow-hidden rounded-3xl border border-border/80 bg-card text-card-foreground shadow-xl transition-all hover:shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_25%,var(--primary-glow),transparent_35rem)]" />
            <div className="absolute right-[-4rem] top-[-4rem] size-72 rounded-full bg-primary/5 blur-3xl" />
            
            <div className="relative grid gap-8 p-6 lg:grid-cols-[1.5fr_0.9fr] lg:p-8">
              <div className="flex flex-col justify-between space-y-6">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-light/60 px-3.5 py-1.5 text-xs font-semibold text-primary">
                    <ShieldCheck className="h-4 w-4" />
                    Secure Command operations center
                  </div>
                  <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-primary sm:text-4xl lg:text-5xl">
                    MediCare Command Center
                  </h1>
                  <p className="mt-3 max-w-xl text-base leading-relaxed text-muted-foreground">
                    Real-time clinical, operational, and financial analytics across wards, pharmacy, laboratories, and billing departments.
                  </p>
                </div>
                
                {/* Secondary indicators */}
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="group rounded-2xl border border-border/60 bg-surface-2/40 p-4 transition-all hover:bg-card hover:shadow-md">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Today's load</p>
                      <CalendarClock className="h-4 w-4 text-primary transition-transform group-hover:scale-110" />
                    </div>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-foreground">{stats.todaysAppointments}</p>
                    <p className="mt-1 text-[11px] font-medium text-muted-foreground/80">active appointments</p>
                  </div>
                  
                  <div className="group rounded-2xl border border-border/60 bg-surface-2/40 p-4 transition-all hover:bg-card hover:shadow-md">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Bed occupancy</p>
                      <BedDouble className="h-4 w-4 text-primary transition-transform group-hover:scale-110" />
                    </div>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-foreground">{bedOccupancy}%</p>
                    <p className="mt-1 text-[11px] font-medium text-muted-foreground/80">{stats.availableBeds} beds available</p>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-4">
                      <div 
                        className="h-full rounded-full bg-primary transition-all duration-500" 
                        style={{ width: `${bedOccupancy}%` }} 
                      />
                    </div>
                  </div>
                  
                  <div className="group rounded-2xl border border-border/60 bg-surface-2/40 p-4 transition-all hover:bg-card hover:shadow-md">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Payments collected</p>
                      <TrendingUp className="h-4 w-4 text-primary transition-transform group-hover:scale-110" />
                    </div>
                    <p className="mt-2 text-2xl font-bold tracking-tight text-foreground">{formatCurrency(stats.totalRevenueCollected)}</p>
                    <p className="mt-2 text-[11px] font-medium text-muted-foreground/80">recorded to date</p>
                  </div>
                </div>
              </div>

              {/* Quick stats panel */}
              <Card className="relative overflow-hidden border-border bg-surface-2/30 backdrop-blur-md">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold tracking-wider uppercase text-muted-foreground">Operational Queue</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-3.5">
                  {[
                    { label: "Upcoming appointments", value: stats.upcomingAppointments, icon: CalendarClock, color: "text-info bg-info-light/70" },
                    { label: "Current Admissions", value: stats.currentAdmissions, icon: BedDouble, color: "text-primary bg-primary-light/70" },
                    { label: "Outstanding Patient Debt", value: formatCurrency(stats.totalOutstandingBalance), icon: DollarSign, color: "text-warning bg-warning-light/70" },
                    { label: "Pending laboratory tests", value: stats.pendingLabOrders, icon: Activity, color: "text-danger bg-danger-light/70" },
                  ].map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <div key={idx} className="flex items-center justify-between gap-4 rounded-xl border border-border/60 bg-card p-3.5 shadow-sm transition-all hover:shadow-md">
                        <div className="flex items-center gap-3">
                          <div className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${item.color}`}>
                            <Icon className="size-5" />
                          </div>
                          <div>
                            <p className="text-xs font-medium text-muted-foreground/90">{item.label}</p>
                            <p className="mt-0.5 text-base font-bold text-foreground">{item.value}</p>
                          </div>
                        </div>
                        <ArrowUpRight className="size-4 text-muted-foreground/40" />
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Smart Insights & Alert Feeds */}
          {insights.length > 0 && (
            <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-r from-primary-light/30 via-card to-card shadow-lg">
              <div className="absolute top-0 right-0 p-3 text-primary opacity-25">
                <Sparkles className="size-16" />
              </div>
              <CardHeader className="flex flex-row items-center gap-2 pb-3">
                <Sparkles className="size-5 text-primary animate-pulse" />
                <CardTitle className="text-lg font-bold text-primary">Smarter Operations Insights</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {insights.map((insight) => {
                  const typeStyles = {
                    critical: { border: "border-danger/30 bg-danger-light/20", text: "text-danger", dot: "bg-danger" },
                    warning: { border: "border-warning/30 bg-warning-light/20", text: "text-warning", dot: "bg-warning" },
                    success: { border: "border-success/30 bg-success-light/20", text: "text-success", dot: "bg-success" },
                    info: { border: "border-info/30 bg-info-light/20", text: "text-info", dot: "bg-info" }
                  }[insight.type];

                  return (
                    <div 
                      key={insight.id} 
                      className={`flex flex-col justify-between rounded-xl border p-4.5 shadow-sm transition-all hover:scale-[1.01] ${typeStyles.border}`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 relative">
                          <span className={`size-2 rounded-full absolute animate-ping ${typeStyles.dot}`} />
                          <span className={`size-2 rounded-full ${typeStyles.dot}`} />
                          <h4 className={`text-sm font-bold pl-1 ${typeStyles.text}`}>{insight.title}</h4>
                        </div>
                        <p className="text-xs leading-relaxed text-muted-foreground">{insight.description}</p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}

          {/* Stats Cards Section */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <Activity className="size-5 text-primary" />
              Department Statistics
            </h2>
            <DashboardStats stats={stats} />
          </section>

          {/* Charts Section */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <TrendingUp className="size-5 text-primary" />
              Interactive Analytics Charts
            </h2>
            <ReportChart stats={stats} />
          </section>
        </div>
      )}
    </div>
  );
}
