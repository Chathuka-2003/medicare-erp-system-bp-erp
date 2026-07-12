"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { DashboardStats as DashboardStatsType } from "@/types/reports.types";
import { formatCurrency } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import {
  Users, Stethoscope, UserCog, CalendarCheck, CalendarClock,
  DollarSign, AlertTriangle, BedDouble, PackageX, FlaskConical,
  Activity, Sparkles, Building2, ClipboardList
} from "lucide-react";

interface DashboardStatsProps {
  stats: DashboardStatsType;
}

type TabType = "all" | "workforce" | "clinical" | "finance" | "inventory";

export function DashboardStats({ stats }: DashboardStatsProps) {
  const [activeTab, setActiveTab] = useState<TabType>("all");

  const cards = [
    // Workforce & Patients
    { 
      label: "Total Patients", 
      value: stats.totalPatients, 
      icon: Users, 
      tone: "bg-primary-light text-primary", 
      line: "bg-primary", 
      hint: "registered clinical records",
      category: "workforce"
    },
    { 
      label: "Total Doctors", 
      value: stats.totalDoctors, 
      icon: Stethoscope, 
      tone: "bg-info-light text-info", 
      line: "bg-info", 
      hint: "active medical providers",
      category: "workforce"
    },
    { 
      label: "Total Staff", 
      value: stats.totalStaff, 
      icon: UserCog, 
      tone: "bg-primary-light text-primary", 
      line: "bg-primary", 
      hint: "administrative & support staff",
      category: "workforce"
    },

    // Clinical Operations
    { 
      label: "Today's Appointments", 
      value: stats.todaysAppointments, 
      icon: CalendarCheck, 
      tone: "bg-success-light text-success", 
      line: "bg-success", 
      hint: "scheduled for today",
      category: "clinical"
    },
    { 
      label: "Upcoming Appointments", 
      value: stats.upcomingAppointments, 
      icon: CalendarClock, 
      tone: "bg-info-light text-info", 
      line: "bg-info", 
      hint: "future clinical sessions",
      category: "clinical"
    },
    { 
      label: "Current Admissions", 
      value: stats.currentAdmissions, 
      icon: BedDouble, 
      tone: "bg-primary-light text-primary", 
      line: "bg-primary", 
      hint: "inpatient census",
      category: "clinical"
    },
    { 
      label: "Bed Availability", 
      value: `${stats.availableBeds} / ${stats.totalBeds}`, 
      icon: BedDouble, 
      tone: "bg-success-light text-success", 
      line: "bg-success", 
      hint: "available of total beds",
      category: "clinical"
    },
    { 
      label: "Pending Lab Orders", 
      value: stats.pendingLabOrders, 
      icon: FlaskConical, 
      tone: stats.pendingLabOrders > 0 ? "bg-warning-light text-warning" : "bg-muted text-muted-foreground", 
      line: stats.pendingLabOrders > 0 ? "bg-warning" : "bg-muted", 
      hint: "awaiting lab technician processing",
      category: "clinical",
      pulse: stats.pendingLabOrders > 0
    },

    // Finance & Billing
    { 
      label: "Revenue Collected", 
      value: formatCurrency(stats.totalRevenueCollected), 
      icon: DollarSign, 
      tone: "bg-success-light text-success", 
      line: "bg-success", 
      hint: "settled invoice payments",
      category: "finance"
    },
    { 
      label: "Outstanding Balance", 
      value: formatCurrency(stats.totalOutstandingBalance), 
      icon: AlertTriangle, 
      tone: stats.totalOutstandingBalance > 0 ? "bg-warning-light text-warning" : "bg-muted text-muted-foreground", 
      line: stats.totalOutstandingBalance > 0 ? "bg-warning" : "bg-muted", 
      hint: "unpaid patient balances",
      category: "finance"
    },
    { 
      label: "Unpaid Invoices", 
      value: stats.unpaidInvoiceCount, 
      icon: ClipboardList, 
      tone: stats.unpaidInvoiceCount > 0 ? "bg-danger-light text-danger" : "bg-muted text-muted-foreground", 
      line: stats.unpaidInvoiceCount > 0 ? "bg-danger" : "bg-muted", 
      hint: "outstanding invoices under review",
      category: "finance",
      pulse: stats.unpaidInvoiceCount > 0
    },

    // Inventory Alerts
    { 
      label: "Low Stock Medicines", 
      value: stats.lowStockMedicineCount, 
      icon: PackageX, 
      tone: stats.lowStockMedicineCount > 0 ? "bg-critical-light text-critical" : "bg-muted text-muted-foreground", 
      line: stats.lowStockMedicineCount > 0 ? "bg-critical" : "bg-muted", 
      hint: "pharmacy stocks below threshold",
      category: "inventory",
      pulse: stats.lowStockMedicineCount > 0
    },
    { 
      label: "Low Stock Supplies", 
      value: stats.lowStockItemCount, 
      icon: PackageX, 
      tone: stats.lowStockItemCount > 0 ? "bg-critical-light text-critical" : "bg-muted text-muted-foreground", 
      line: stats.lowStockItemCount > 0 ? "bg-critical" : "bg-muted", 
      hint: "general supplies below reorder point",
      category: "inventory",
      pulse: stats.lowStockItemCount > 0
    },
  ];

  // Count alerts to show notification bubbles on tabs
  const financeAlertCount = stats.unpaidInvoiceCount;
  const inventoryAlertCount = stats.lowStockMedicineCount + stats.lowStockItemCount;

  const tabs = [
    { id: "all", label: "All Stats", icon: Activity, alertCount: undefined },
    { id: "workforce", label: "Workforce", icon: Users, alertCount: undefined },
    { id: "clinical", label: "Clinical", icon: Building2, alertCount: undefined },
    { 
      id: "finance", 
      label: "Finance", 
      icon: DollarSign,
      alertCount: financeAlertCount > 0 ? financeAlertCount : undefined 
    },
    { 
      id: "inventory", 
      label: "Inventory", 
      icon: ClipboardList,
      alertCount: inventoryAlertCount > 0 ? inventoryAlertCount : undefined 
    },
  ] as const;

  const filteredCards = activeTab === "all" 
    ? cards 
    : cards.filter(card => card.category === activeTab);

  return (
    <div className="space-y-6">
      {/* Category Tabs Selector */}
      <div className="flex flex-wrap gap-2 border-b border-border/80 pb-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "relative flex items-center gap-2.5 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground shadow-md scale-105"
                  : "bg-surface-2 text-muted-foreground hover:bg-surface-3 hover:text-foreground"
              )}
            >
              <Icon className="size-4" />
              <span>{tab.label}</span>
              {tab.alertCount !== undefined && (
                <span className={cn(
                  "flex size-4.5 items-center justify-center rounded-full text-[9px] font-bold text-white leading-none",
                  isActive ? "bg-white text-primary" : "bg-danger"
                )}>
                  {tab.alertCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Card 
              key={idx} 
              className="group overflow-hidden border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-md duration-300 animate-in slide-in-from-bottom-2 duration-300"
              style={{ animationDelay: `${idx * 40}ms` }}
            >
              {/* Highlight accent line */}
              <div className={cn("h-1 w-full", card.line)} />
              
              <CardContent className="flex items-start gap-4 pt-5 pb-5">
                <div className={cn(
                  "relative flex size-12 shrink-0 items-center justify-center rounded-xl shadow-sm transition-transform duration-300 group-hover:scale-105", 
                  card.tone
                )}>
                  <Icon className="size-5" />
                  {card.pulse && (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-danger opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-danger"></span>
                    </span>
                  )}
                </div>
                
                <div className="min-w-0 flex-1 space-y-1">
                  <p className="truncate text-xs font-semibold uppercase tracking-wider text-muted-foreground">{card.label}</p>
                  <p className="truncate text-2xl font-black tracking-tight text-foreground">{card.value}</p>
                  <p className="truncate text-[11px] font-medium text-muted-foreground/80 leading-normal">{card.hint}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
