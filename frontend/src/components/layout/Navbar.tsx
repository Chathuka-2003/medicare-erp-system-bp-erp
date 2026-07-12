"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Menu, Bell, Search, User, Check, Trash2, Clock, ShieldAlert, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { Breadcrumbs } from "./Breadcrumbs";
import { UserRole } from "@/types/auth.types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils/cn";
import { formatDateTime } from "@/lib/utils/format";

interface NavbarProps {
  onMenuClick: () => void;
}

// In-memory simulation of clinical notifications
interface ClinicalNotification {
  id: string;
  title: string;
  desc: string;
  time: Date;
  read: boolean;
  type: "warning" | "info" | "success";
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const { data: session } = useSession();
  const role = session?.user?.role as UserRole | undefined;

  const [notifications, setNotifications] = useState<ClinicalNotification[]>([
    {
      id: "1",
      title: "Low Stock Alert",
      desc: "Amoxicillin 500mg capsules have fallen below reorder level.",
      time: new Date(Date.now() - 1000 * 60 * 15), // 15 mins ago
      read: false,
      type: "warning",
    },
    {
      id: "2",
      title: "Pending Lab Specimen",
      desc: "Patient John Doe requires urgent serum analysis for Order #LB-1049.",
      time: new Date(Date.now() - 1000 * 60 * 45), // 45 mins ago
      read: false,
      type: "info",
    },
    {
      id: "3",
      title: "Ward Bed Admission",
      desc: "Bed #W-04 (Male General Ward) is now occupied by admitted patient.",
      time: new Date(Date.now() - 1000 * 60 * 120), // 2 hrs ago
      read: true,
      type: "success",
    },
  ]);

  // Periodically insert mock alerts to simulate real-time notification socket updates
  useEffect(() => {
    const alertPool = [
      { title: "New Appointment", desc: "Dr. Alwis has a new confirmed appointment at 10:30 AM.", type: "success" },
      { title: "Low Stock Alert", desc: "Surgical Gloves (Size L) inventory is critically low.", type: "warning" },
      { title: "Lab Result Completed", desc: "Order #LB-1035 results completed by technician.", type: "info" },
      { title: "Invoice Unpaid", desc: "Invoice #INV-3059 outstanding balance is overdue.", type: "warning" }
    ];

    const interval = setInterval(() => {
      const selected = alertPool[Math.floor(Math.random() * alertPool.length)];
      const newAlert: ClinicalNotification = {
        id: String(Date.now()),
        title: selected.title,
        desc: selected.desc,
        time: new Date(),
        read: false,
        type: selected.type as any
      };
      setNotifications(prev => [newAlert, ...prev].slice(0, 10)); // Keep last 10
    }, 45000); // Trigger every 45s

    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markAsRead = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const deleteNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const formatRoleName = (r?: string) => {
    if (!r) return "";
    return r.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border/50 bg-background/80 px-6 backdrop-blur-md">
      <div className="flex items-center gap-4">
        {/* Toggle Mobile Sidebar */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="lg:hidden rounded-full hover:bg-muted"
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5 text-muted-foreground" />
        </Button>

        {/* Breadcrumbs for Navigation History */}
        <div className="hidden md:block">
          <Breadcrumbs />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Search Placeholder */}
        <div className="relative hidden max-w-xs sm:block">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
          <input
            type="search"
            placeholder="Search records..."
            className="h-9 w-44 rounded-full border border-border/60 bg-muted/30 pl-9 pr-4 text-xs font-medium placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all md:w-56"
          />
        </div>

        {/* Notifications Dropdown Panel */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full w-9 h-9 text-muted-foreground hover:text-foreground relative"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-80 sm:w-96 rounded-2xl border-slate-100 p-0 shadow-xl bg-white text-slate-800" align="end">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-100 rounded-t-2xl">
              <div>
                <p className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <span>Notifications</span>
                  {unreadCount > 0 && (
                    <span className="bg-indigo-100 text-indigo-700 text-[10px] px-2 py-0.5 rounded-full font-black">
                      {unreadCount} new
                    </span>
                  )}
                </p>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Real-time clinical alerts</p>
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  Mark all read
                </button>
              )}
            </div>

            {/* List */}
            <div className="max-h-[360px] overflow-y-auto divide-y divide-slate-100">
              {notifications.length === 0 ? (
                <div className="text-center py-10 text-slate-400 space-y-2">
                  <Bell className="h-8 w-8 mx-auto opacity-20" />
                  <p className="text-xs font-bold text-slate-700">All caught up</p>
                  <p className="text-[10px] text-slate-400 max-w-[180px] mx-auto leading-normal">No recent clinical notifications or system alerts.</p>
                </div>
              ) : (
                notifications.map((n) => {
                  return (
                    <div
                      key={n.id}
                      className={cn(
                        "p-4 transition-colors hover:bg-slate-50/50 flex gap-3 relative group",
                        !n.read && "bg-indigo-50/20"
                      )}
                    >
                      {/* Icon type */}
                      <div className="shrink-0 pt-0.5">
                        <div className={cn(
                          "h-7 w-7 rounded-lg flex items-center justify-center border",
                          n.type === "warning" ? "bg-amber-50 text-amber-600 border-amber-100" :
                          n.type === "success" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                          "bg-blue-50 text-blue-600 border-blue-100"
                        )}>
                          {n.type === "warning" ? <ShieldAlert className="h-4 w-4" /> :
                           n.type === "success" ? <Check className="h-4 w-4" /> :
                           <Clock className="h-4 w-4" />}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 space-y-1 pr-6">
                        <div className="flex justify-between items-start">
                          <p className={cn("text-xs font-bold text-slate-800 truncate", !n.read && "text-indigo-900")}>
                            {n.title}
                          </p>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-normal font-medium whitespace-pre-wrap">
                          {n.desc}
                        </p>
                        <p className="text-[9px] text-slate-400 font-semibold">
                          {formatDateTime(n.time.toISOString())}
                        </p>
                      </div>

                      {/* Quick controls on hover */}
                      <div className="absolute right-3 top-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!n.read && (
                          <button
                            onClick={(e) => markAsRead(n.id, e)}
                            className="h-6 w-6 rounded-md bg-white border shadow-sm flex items-center justify-center text-slate-400 hover:text-slate-800 transition-colors"
                            title="Mark as read"
                          >
                            <Check className="h-3.5 w-3.5" />
                          </button>
                        )}
                        <button
                          onClick={(e) => deleteNotification(n.id, e)}
                          className="h-6 w-6 rounded-md bg-white border shadow-sm flex items-center justify-center text-slate-400 hover:text-red-650 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* User Mini Profile */}
        {session?.user && (
          <div className="flex items-center gap-2.5 pl-2 border-l border-border/50">
            <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/20 font-bold text-xs">
              {session.user.firstName?.[0]}
              {session.user.lastName?.[0]}
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-bold text-foreground max-w-[100px] truncate">
                {session.user.firstName}
              </p>
              <p className="text-[10px] font-medium text-muted-foreground/80">
                {formatRoleName(role)}
              </p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
