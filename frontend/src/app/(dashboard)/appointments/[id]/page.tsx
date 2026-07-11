"use client";

import { useParams, useRouter } from "next/navigation";
import { useAppointment, useCancelAppointment, useUpdateAppointmentStatus } from "@/hooks/useAppointments";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { formatDateTime } from "@/lib/utils/format";
import { ROUTES } from "@/lib/constants/routes";
import { AppointmentStatus } from "@/types/appointment.types";
import { cn } from "@/lib/utils/cn";
import {
  ArrowLeft, User, Stethoscope, CalendarDays, ClipboardList,
  StickyNote, CheckCircle2, XCircle, RefreshCcw, Clock,
  CalendarCheck, CalendarX, AlertCircle, Edit2,
} from "lucide-react";

// ─── Status config (same as list page) ───────────────────────────────────────
const STATUS_CONFIG: Record<AppointmentStatus, {
  label: string; icon: React.ElementType;
  badge: string; bg: string; border: string; text: string;
}> = {
  SCHEDULED:   { label: "Scheduled",   icon: Clock,        badge: "bg-blue-100 text-blue-700",     bg: "bg-blue-50",   border: "border-blue-200", text: "text-blue-700"   },
  CONFIRMED:   { label: "Confirmed",   icon: CheckCircle2, badge: "bg-indigo-100 text-indigo-700", bg: "bg-indigo-50", border: "border-indigo-200",text: "text-indigo-700" },
  IN_PROGRESS: { label: "In Progress", icon: RefreshCcw,   badge: "bg-amber-100 text-amber-700",   bg: "bg-amber-50",  border: "border-amber-200", text: "text-amber-700"  },
  COMPLETED:   { label: "Completed",   icon: CalendarCheck,badge: "bg-emerald-100 text-emerald-700",bg:"bg-emerald-50",border:"border-emerald-200",text:"text-emerald-700" },
  CANCELLED:   { label: "Cancelled",   icon: CalendarX,    badge: "bg-red-100 text-red-700",       bg: "bg-red-50",    border: "border-red-200",   text: "text-red-700"    },
  NO_SHOW:     { label: "No Show",     icon: AlertCircle,  badge: "bg-orange-100 text-orange-700", bg: "bg-orange-50", border: "border-orange-200",text: "text-orange-700" },
  RESCHEDULED: { label: "Rescheduled", icon: RefreshCcw,   badge: "bg-purple-100 text-purple-700", bg: "bg-purple-50", border: "border-purple-200",text: "text-purple-700" },
};

function InfoRow({ icon: Icon, label, value }: {
  icon: React.ElementType; label: string; value: string;
}) {
  return (
    <div className="flex items-start gap-3 py-3 border-b last:border-0">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="mt-0.5 text-sm font-medium text-foreground leading-snug">{value}</p>
      </div>
    </div>
  );
}

export default function AppointmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: appointment, isLoading } = useAppointment(params.id as string);
  const cancelMutation = useCancelAppointment();
  const statusMutation = useUpdateAppointmentStatus();

  if (isLoading) return <LoadingSpinner />;
  if (!appointment) return (
    <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground space-y-3">
      <CalendarDays className="h-10 w-10 opacity-20" />
      <p className="font-semibold">Appointment not found</p>
      <Button variant="outline" size="sm" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Go back
      </Button>
    </div>
  );

  const cfg     = STATUS_CONFIG[appointment.status];
  const Icon    = cfg?.icon ?? Clock;
  const isFinal = appointment.status === AppointmentStatus.CANCELLED || appointment.status === AppointmentStatus.COMPLETED;
  const apptDate = new Date(appointment.appointmentDate);

  return (
    <div className="space-y-6 p-6 max-w-3xl mx-auto">
      {/* ── Back + header ──────────────────────────────────────────────── */}
      <div>
        <button
          onClick={() => router.push(ROUTES.APPOINTMENTS)}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Appointments
        </button>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Appointment Details</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Created {formatDateTime(appointment.createdAt)}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {appointment.status === AppointmentStatus.SCHEDULED && (
              <Button
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
                onClick={() => statusMutation.mutate({ id: appointment.id, status: AppointmentStatus.CONFIRMED })}
              >
                <CheckCircle2 className="h-4 w-4" />
                Confirm
              </Button>
            )}
            {!isFinal && (
              <Button
                size="sm"
                variant="destructive"
                className="gap-2"
                onClick={() => {
                  if (confirm("Cancel this appointment?")) {
                    cancelMutation.mutate(appointment.id, {
                      onSuccess: () => router.push(ROUTES.APPOINTMENTS),
                    });
                  }
                }}
              >
                <XCircle className="h-4 w-4" />
                Cancel
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* ── Status hero banner ─────────────────────────────────────────── */}
      <Card className={cn("overflow-hidden border", cfg?.border)}>
        <div className={cn("px-5 py-4 flex items-center gap-4", cfg?.bg)}>
          <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl border", cfg?.border, "bg-white/60")}>
            <Icon className={cn("h-6 w-6", cfg?.text)} />
          </div>
          <div className="flex-1">
            <p className={cn("text-xs font-bold uppercase tracking-widest", cfg?.text)}>Status</p>
            <p className={cn("text-xl font-black", cfg?.text)}>{cfg?.label}</p>
          </div>

          {/* Date block */}
          <div className="text-right shrink-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Scheduled</p>
            <p className="text-lg font-black text-foreground leading-tight">
              {apptDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </p>
            <p className="text-sm font-semibold text-muted-foreground">
              {apptDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
        </div>
      </Card>

      {/* ── Details grid ─────────────────────────────────────────────── */}
      <div className="grid gap-6 sm:grid-cols-2">
        {/* People */}
        <Card>
          <CardHeader className="pb-0 pt-4 px-4">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              People
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-3">
            <InfoRow icon={User}        label="Patient" value={appointment.patientName} />
            <InfoRow icon={Stethoscope} label="Doctor"  value={appointment.doctorName}  />
          </CardContent>
        </Card>

        {/* Appointment info */}
        <Card>
          <CardHeader className="pb-0 pt-4 px-4">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Appointment
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-3">
            <InfoRow icon={CalendarDays}  label="Date & Time" value={formatDateTime(appointment.appointmentDate)} />
            <InfoRow icon={ClipboardList} label="Reason"      value={appointment.reason ?? "—"} />
          </CardContent>
        </Card>
      </div>

      {/* Notes — full width */}
      <Card>
        <CardHeader className="pb-0 pt-4 px-4">
          <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Clinical Notes
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          {appointment.notes ? (
            <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap rounded-lg bg-muted/40 p-4">
              {appointment.notes}
            </p>
          ) : (
            <div className="flex items-center gap-2 rounded-lg bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
              <StickyNote className="h-4 w-4" />
              No notes recorded for this appointment.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Meta footer */}
      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground border-t pt-4">
        <span>ID: <span className="font-mono">{appointment.id}</span></span>
        {appointment.updatedAt && (
          <span>Last updated: {formatDateTime(appointment.updatedAt)}</span>
        )}
      </div>
    </div>
  );
}
