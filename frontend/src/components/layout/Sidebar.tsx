"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { hasRole, ROLE_GROUPS } from "@/lib/constants/roles";
import { UserRole } from "@/types/auth.types";
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  CreditCard,
  Pill,
  FlaskConical,
  BedDouble,
  ClipboardList,
  TrendingUp,
  LogOut,
  X,
  HeartPulse,
  UserCheck
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = session?.user?.role as UserRole | undefined;

  const menuItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      allowed: ROLE_GROUPS.DASHBOARD,
    },
    {
      label: "Patients",
      href: "/patients",
      icon: Users,
      allowed: ROLE_GROUPS.PATIENT_MANAGEMENT,
    },
    {
      label: "Appointments",
      href: "/appointments",
      icon: Calendar,
      allowed: ROLE_GROUPS.APPOINTMENTS,
    },
    {
      label: "EMR",
      href: "/emr",
      icon: FileText,
      allowed: ROLE_GROUPS.EMR,
    },
    {
      label: "Staff Directory",
      href: "/staff/doctors",
      icon: UserCheck,
      allowed: ROLE_GROUPS.DOCTOR_DIRECTORY,
    },
    {
      label: "Employees",
      href: "/staff/employees",
      icon: Users,
      allowed: ROLE_GROUPS.STAFF_MANAGEMENT,
    },
    {
      label: "Billing & Finance",
      href: "/billing",
      icon: CreditCard,
      allowed: ROLE_GROUPS.BILLING,
    },
    {
      label: "Pharmacy",
      href: "/pharmacy",
      icon: Pill,
      allowed: ROLE_GROUPS.PHARMACY,
    },
    {
      label: "Laboratory",
      href: "/laboratory",
      icon: FlaskConical,
      allowed: ROLE_GROUPS.LABORATORY,
    },
    {
      label: "Ward Admission",
      href: "/ward",
      icon: BedDouble,
      allowed: ROLE_GROUPS.WARD,
    },
    {
      label: "Inventory",
      href: "/inventory",
      icon: ClipboardList,
      allowed: ROLE_GROUPS.INVENTORY,
    },
    {
      label: "Reports & Analytics",
      href: "/reports",
      icon: TrendingUp,
      allowed: ROLE_GROUPS.REPORTS,
    },
  ];

  const filteredMenuItems = menuItems.filter(item => hasRole(role, item.allowed));

  const formatRoleName = (r?: string) => {
    if (!r) return "";
    return r.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
  };

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border/50 bg-card/85 backdrop-blur-md transition-transform duration-300 lg:static lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Sidebar Header */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-border/50">
          <Link href="/dashboard" className="flex items-center gap-2.5" onClick={onClose}>
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/20">
              <HeartPulse className="h-5.5 w-5.5" />
            </div>
            <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              MediCare ERP
            </span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="lg:hidden rounded-full hover:bg-muted"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </Button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 space-y-1 px-4 py-6 overflow-y-auto custom-scrollbar">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-semibold transition-all group duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/10"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                )}
              >
                <Icon className={cn(
                  "h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-105",
                  isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                )} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer User Section */}
        {session?.user && (
          <div className="border-t border-border/50 bg-muted/30 p-5">
            <div className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm border border-primary/20">
                {session.user.firstName?.[0]}
                {session.user.lastName?.[0]}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-foreground">
                  {session.user.firstName} {session.user.lastName}
                </p>
                <p className="truncate text-xs font-semibold text-muted-foreground">
                  {formatRoleName(role)}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl text-muted-foreground border-border/60 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 transition-all font-semibold"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        )}
      </aside>
    </>
  );
}
