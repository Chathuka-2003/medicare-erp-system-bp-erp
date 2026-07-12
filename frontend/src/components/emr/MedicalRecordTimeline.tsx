"use client";

import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/common/EmptyState";
import { MedicalRecord } from "@/types/emr.types";
import { formatDate } from "@/lib/utils/format";
import { Stethoscope, Pill, FlaskConical, Ambulance, CalendarDays, ChevronRight } from "lucide-react";

interface MedicalRecordTimelineProps {
  records: MedicalRecord[];
}

const RECORD_TYPE_META: Record<
  string,
  { icon: React.ElementType; color: string; bg: string }
> = {
  CONSULTATION:      { icon: Stethoscope, color: "text-blue-600",   bg: "bg-blue-50 dark:bg-blue-950" },
  FOLLOW_UP:         { icon: CalendarDays, color: "text-violet-600", bg: "bg-violet-50 dark:bg-violet-950" },
  EMERGENCY:         { icon: Ambulance,   color: "text-red-600",    bg: "bg-red-50 dark:bg-red-950" },
  SURGERY:           { icon: Stethoscope, color: "text-orange-600", bg: "bg-orange-50 dark:bg-orange-950" },
  LAB_REVIEW:        { icon: FlaskConical,color: "text-teal-600",   bg: "bg-teal-50 dark:bg-teal-950" },
  ROUTINE_CHECKUP:   { icon: CalendarDays,color: "text-green-600",  bg: "bg-green-50 dark:bg-green-950" },
  DISCHARGE_SUMMARY: { icon: Pill,        color: "text-pink-600",   bg: "bg-pink-50 dark:bg-pink-950" },
};

export function MedicalRecordTimeline({ records }: MedicalRecordTimelineProps) {
  const router = useRouter();

  if (records.length === 0) {
    return (
      <EmptyState
        title="No medical records found"
        description="This patient has no recorded visits yet."
      />
    );
  }

  const sorted = [...records].sort(
    (a, b) => new Date(b.recordDate).getTime() - new Date(a.recordDate).getTime()
  );

  return (
    <div className="relative space-y-0">
      {/* Vertical timeline line */}
      <div className="absolute left-[28px] top-4 bottom-4 w-px bg-border" aria-hidden />

      {sorted.map((record) => {
        const meta = RECORD_TYPE_META[record.recordType] ?? RECORD_TYPE_META.CONSULTATION;
        const Icon = meta.icon;

        return (
          <div key={record.id} className="relative flex gap-4 pb-4 group">
            {/* Icon node */}
            <div
              className={`relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-background shadow-sm ${meta.bg}`}
            >
              <Icon className={`h-5 w-5 ${meta.color}`} />
            </div>

            {/* Card body */}
            <div
              className="flex-1 cursor-pointer rounded-xl border bg-card shadow-sm transition-all hover:shadow-md hover:border-primary/40 hover:-translate-y-0.5"
              onClick={() => router.push(`/emr/records/${record.id}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && router.push(`/emr/records/${record.id}`)}
            >
              <div className="flex items-start justify-between p-4">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold">{formatDate(record.recordDate)}</p>
                    <Badge
                      variant="secondary"
                      className="text-xs"
                    >
                      {record.recordType.replace(/_/g, " ")}
                    </Badge>
                    {record.diagnoses.length > 0 && (
                      <Badge variant="outline" className="text-xs">
                        {record.diagnoses.length} Diagnos{record.diagnoses.length === 1 ? "is" : "es"}
                      </Badge>
                    )}
                    {record.prescription && (
                      <Badge variant="outline" className="text-xs text-emerald-600 border-emerald-300 bg-emerald-50 dark:bg-emerald-950">
                        Rx
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Dr. {record.doctorName}
                  </p>
                  {record.description && (
                    <p className="text-sm line-clamp-2">{record.description}</p>
                  )}
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1 group-hover:text-primary transition-colors" />
              </div>

              {/* Vitals mini summary */}
              {record.vitals && (
                <div className="flex flex-wrap gap-4 border-t px-4 py-2 text-xs text-muted-foreground">
                  {record.vitals.heartRate && <span>❤️ {record.vitals.heartRate} bpm</span>}
                  {record.vitals.temperature && <span>🌡 {record.vitals.temperature} °C</span>}
                  {record.vitals.bloodPressure && <span>💉 {record.vitals.bloodPressure} mmHg</span>}
                  {record.vitals.weight && <span>⚖️ {record.vitals.weight} kg</span>}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
