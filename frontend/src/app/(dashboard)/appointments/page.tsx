"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { Pagination } from "@/components/common/Pagination";
import { useAppointments, useAppointmentsByDoctor, useCancelAppointment, useUpdateAppointmentStatus } from "@/hooks/useAppointments";
import { AppointmentStatus, Appointment } from "@/types/appointment.types";
import { usePagination } from "@/hooks/usePagination";
import { doctorApi } from "@/lib/api/staff.api";
import { ROUTES } from "@/lib/constants/routes";
import { formatDateTime } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import {
  Plus, Search, CalendarDays, Stethoscope, User,
  CheckCircle2, XCircle, Eye, Clock, ChevronRight,
  CalendarCheck, CalendarX, AlertCircle, RefreshCcw,
  Filter,
} from "lucide-react";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<AppointmentStatus, {
  label: string;
  icon: React.ElementType;
  badge: string;
  dot: string;
}> = {
  SCHEDULED:   { label: "Scheduled",   icon: Clock,        badge: "bg-blue-100 text-blue-700 border-blue-200",    dot: "bg-blue-500"    },
  CONFIRMED:   { label: "Confirmed",   icon: CheckCircle2, badge: "bg-indigo-100 text-indigo-700 border-indigo-200", dot: "bg-indigo-500" },
  IN_PROGRESS: { label: "In Progress", icon: RefreshCcw,   badge: "bg-amber-100 text-amber-700 border-amber-200",  dot: "bg-amber-500"   },
  COMPLETED:   { label: "Completed",   icon: CalendarCheck, badge: "bg-emerald-100 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
  CANCELLED:   { label: "Cancelled",   icon: CalendarX,    badge: "bg-red-100 text-red-700 border-red-200",        dot: "bg-red-500"     },
  NO_SHOW:     { label: "No Show",     icon: AlertCircle,  badge: "bg-orange-100 text-orange-700 border-orange-200", dot: "bg-orange-500" },
  RESCHEDULED: { label: "Rescheduled", icon: RefreshCcw,   badge: "bg-purple-100 text-purple-700 border-purple-200", dot: "bg-purple-500" },
};

function StatusPill({ status }: { status: AppointmentStatus }) {
  const cfg = STATUS_CONFIG[status] ?? { label: status, badge: "bg-gray-100 text-gray-600", dot: "bg-gray-400", icon: Clock };
  const Icon = cfg.icon;
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold", cfg.badge)}>
      <Icon className="h-3 w-3" />
      {cfg.label}
    </span>
  );
}

function StatCard({ label, value, icon: Icon, colour }: {
  label: string; value: number; icon: React.ElementType; colour: string;
}) {
  return (
    <Card className="hover:shadow-md transition-all hover:-translate-y-0.5 duration-200">
      <CardContent className="flex items-center gap-4 pt-4 pb-4">
        <div className={cn("rounded-xl p-3", colour)}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-2xl font-black">{value}</p>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Appointment Card ─────────────────────────────────────────────────────────
function AppointmentCard({
  appt, onApprove, onCancel, onView,
}: {
  appt: Appointment;
  onApprove: (id: string) => void;
  onCancel:  (id: string) => void;
  onView:    (id: string) => void;
}) {
  const cfg = STATUS_CONFIG[appt.status];
  const isActive = appt.status === AppointmentStatus.SCHEDULED;
  const isFinal  = appt.status === AppointmentStatus.CANCELLED || appt.status === AppointmentStatus.COMPLETED;

  return (
    <Card
      className={cn(
        "group relative overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer",
        appt.status === AppointmentStatus.CANCELLED && "opacity-70"
      )}
      onClick={() => onView(appt.id)}
    >
      {/* Left accent stripe */}
      <div className={cn("absolute left-0 top-0 bottom-0 w-1 rounded-l-xl", cfg?.dot ?? "bg-gray-400")} />

      <CardContent className="pl-5 pr-4 py-4 flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Date/time block */}
        <div className="shrink-0 flex flex-col items-center justify-center rounded-xl border bg-muted/40 px-3 py-2.5 min-w-[80px] text-center">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            {new Date(appt.appointmentDate).toLocaleDateString("en-US", { month: "short" })}
          </p>
          <p className="text-2xl font-black leading-none">
            {new Date(appt.appointmentDate).getDate()}
          </p>
          <p className="text-[11px] font-semibold text-muted-foreground mt-0.5">
            {new Date(appt.appointmentDate).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>

        {/* Main info */}
        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <StatusPill status={appt.status} />
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <span className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
              <User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              {appt.patientName}
            </span>
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Stethoscope className="h-3.5 w-3.5 shrink-0" />
              {appt.doctorName}
            </span>
          </div>

          {appt.reason && (
            <p className="text-xs text-muted-foreground truncate max-w-sm">
              <span className="font-medium">Reason:</span> {appt.reason}
            </p>
          )}
        </div>

        {/* Actions */}
        <div
          className="flex shrink-0 items-center gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          {isActive && (
            <Button
              size="sm"
              variant="ghost"
              className="h-8 gap-1.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
              onClick={() => onApprove(appt.id)}
              title="Confirm appointment"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span className="hidden sm:inline text-xs font-semibold">Confirm</span>
            </Button>
          )}

          <Button
            size="sm"
            variant="ghost"
            className="h-8 gap-1.5 text-primary hover:text-primary/80"
            onClick={() => onView(appt.id)}
            title="View details"
          >
            <Eye className="h-4 w-4" />
            <span className="hidden sm:inline text-xs font-semibold">View</span>
          </Button>

          {!isFinal && (
            <Button
              size="sm"
              variant="ghost"
              className="h-8 gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => {
                if (confirm("Cancel this appointment?")) onCancel(appt.id);
              }}
              title="Cancel appointment"
            >
              <XCircle className="h-4 w-4" />
              <span className="hidden sm:inline text-xs font-semibold">Cancel</span>
            </Button>
          )}

          <ChevronRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors ml-1" />
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AppointmentsPage() {
  const router = useRouter();
  const [doctorId, setDoctorId]         = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | "ALL">("ALL");
  const [search, setSearch]             = useState("");
  const { page, size, setPage }         = usePagination(0, 15);

  const { data: doctors, isLoading: isLoadingDoctors } = useQuery({
    queryKey: ["doctors-lookup"],
    queryFn: () => doctorApi.getAll({ page: 0, size: 100 }),
  });

  const allAppointments    = useAppointments({ page, size, sortBy: "appointmentDate", sortDirection: "DESC" });
  const doctorAppointments = useAppointmentsByDoctor(doctorId !== "ALL" ? doctorId : undefined);
  const cancelMutation     = useCancelAppointment();
  const statusMutation     = useUpdateAppointmentStatus();

  const isFilteredByDoctor = doctorId !== "ALL";
  const isLoading = isFilteredByDoctor ? doctorAppointments.isLoading : allAppointments.isLoading;
  const isError   = isFilteredByDoctor ? doctorAppointments.isError   : allAppointments.isError;
  const rawList   = isFilteredByDoctor
    ? (doctorAppointments.data ?? [])
    : (allAppointments.data?.content ?? []);

  // Client-side filter: status + search
  const appointments = useMemo(() => {
    return rawList.filter((a) => {
      if (statusFilter !== "ALL" && a.status !== statusFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          a.patientName?.toLowerCase().includes(q) ||
          a.doctorName?.toLowerCase().includes(q) ||
          a.reason?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [rawList, statusFilter, search]);

  // Stat counts from raw list
  const counts = useMemo(() => ({
    all:        rawList.length,
    scheduled:  rawList.filter((a) => a.status === AppointmentStatus.SCHEDULED).length,
    confirmed:  rawList.filter((a) => a.status === AppointmentStatus.CONFIRMED).length,
    inProgress: rawList.filter((a) => a.status === AppointmentStatus.IN_PROGRESS).length,
    completed:  rawList.filter((a) => a.status === AppointmentStatus.COMPLETED).length,
    cancelled:  rawList.filter((a) => a.status === AppointmentStatus.CANCELLED).length,
  }), [rawList]);

  const statusTabs: Array<{ value: AppointmentStatus | "ALL"; label: string; count: number; colour: string }> = [
    { value: "ALL",                          label: "All",         count: counts.all,        colour: "border-slate-400 text-slate-700"    },
    { value: AppointmentStatus.SCHEDULED,    label: "Scheduled",   count: counts.scheduled,  colour: "border-blue-400 text-blue-700"      },
    { value: AppointmentStatus.CONFIRMED,    label: "Confirmed",   count: counts.confirmed,  colour: "border-indigo-400 text-indigo-700"  },
    { value: AppointmentStatus.IN_PROGRESS,  label: "In Progress", count: counts.inProgress, colour: "border-amber-400 text-amber-700"    },
    { value: AppointmentStatus.COMPLETED,    label: "Completed",   count: counts.completed,  colour: "border-emerald-400 text-emerald-700"},
    { value: AppointmentStatus.CANCELLED,    label: "Cancelled",   count: counts.cancelled,  colour: "border-red-400 text-red-700"        },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* ── Header ────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Appointments</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage and track all patient appointments
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push(ROUTES.APPOINTMENTS + "/calendar")}>
            <CalendarDays className="mr-2 h-4 w-4" />
            Calendar
          </Button>
          <Button onClick={() => router.push(ROUTES.APPOINTMENTS + "/new")}>
            <Plus className="mr-2 h-4 w-4" />
            New Appointment
          </Button>
        </div>
      </div>

      {/* ── Stat cards ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard label="Total"      value={counts.all}        icon={CalendarDays}  colour="bg-slate-100 text-slate-600"    />
        <StatCard label="Scheduled"  value={counts.scheduled}  icon={Clock}         colour="bg-blue-100 text-blue-600"      />
        <StatCard label="Confirmed"  value={counts.confirmed}  icon={CheckCircle2}  colour="bg-indigo-100 text-indigo-600"  />
        <StatCard label="Completed"  value={counts.completed}  icon={CalendarCheck} colour="bg-emerald-100 text-emerald-600"/>
        <StatCard label="Cancelled"  value={counts.cancelled}  icon={CalendarX}     colour="bg-red-100 text-red-600"        />
      </div>

      {/* ── Filters bar ───────────────────────────────────────────────── */}
      <Card>
        <CardContent className="pt-4 pb-4 flex flex-col gap-4">
          {/* Search + Doctor */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Search patient, doctor or reason…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={doctorId} onValueChange={setDoctorId}>
              <SelectTrigger className="w-full sm:w-56">
                <Filter className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                <SelectValue placeholder="Filter by doctor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Doctors</SelectItem>
                {isLoadingDoctors && <SelectItem value="loading" disabled>Loading…</SelectItem>}
                {doctors?.content.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    Dr. {d.firstName} {d.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status tab pills */}
          <div className="flex flex-wrap gap-2">
            {statusTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setStatusFilter(tab.value)}
                className={cn(
                  "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all duration-150",
                  statusFilter === tab.value
                    ? cn("shadow-sm scale-105", tab.colour, "bg-white")
                    : "border-transparent bg-muted text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                )}
              >
                {tab.label}
                <span className={cn(
                  "rounded-full px-1.5 py-0.5 text-[10px] font-bold min-w-[18px] text-center",
                  statusFilter === tab.value ? "bg-current/10" : "bg-background"
                )}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── Appointment list ──────────────────────────────────────────── */}
      {isLoading ? (
        <LoadingSpinner />
      ) : isError ? (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="flex items-center gap-3 pt-5 pb-5">
            <AlertCircle className="h-5 w-5 text-destructive shrink-0" />
            <div className="text-sm">
              <p className="font-semibold text-destructive">Failed to load appointments</p>
              <p className="text-muted-foreground text-xs mt-0.5">Check that the backend API is running and you are signed in.</p>
            </div>
          </CardContent>
        </Card>
      ) : appointments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground space-y-3">
          <CalendarDays className="h-12 w-12 opacity-20" />
          <p className="font-semibold">No appointments found</p>
          <p className="text-xs">Try adjusting the filters or schedule a new appointment.</p>
          <Button size="sm" onClick={() => router.push(ROUTES.APPOINTMENTS + "/new")}>
            <Plus className="mr-2 h-3.5 w-3.5" /> Schedule Now
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground px-0.5">
            Showing <strong>{appointments.length}</strong> appointment{appointments.length !== 1 ? "s" : ""}
            {search && ` matching "${search}"`}
          </p>

          {appointments.map((appt) => (
            <AppointmentCard
              key={appt.id}
              appt={appt}
              onView={(id) => router.push(`/appointments/${id}`)}
              onApprove={(id) => statusMutation.mutate({ id, status: AppointmentStatus.CONFIRMED })}
              onCancel={(id) => cancelMutation.mutate(id)}
            />
          ))}

          {!isFilteredByDoctor && allAppointments.data && (
            <div className="pt-2">
              <Pagination
                page={allAppointments.data.pageNumber}
                totalPages={allAppointments.data.totalPages}
                onPageChange={setPage}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
