"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/common/EmptyState";
import { MedicalRecord } from "@/types/emr.types";
import { formatDate } from "@/lib/utils/format";

interface MedicalRecordTimelineProps {
  records: MedicalRecord[];
}

export function MedicalRecordTimeline({ records }: MedicalRecordTimelineProps) {
  const router = useRouter();

  if (records.length === 0) {
    return <EmptyState title="No medical records found" description="This patient has no recorded visits yet." />;
  }

  const sorted = [...records].sort(
    (a, b) => new Date(b.recordDate).getTime() - new Date(a.recordDate).getTime()
  );

  return (
    <div className="space-y-3">
      {sorted.map((record) => (
        <Card
          key={record.id}
          className="cursor-pointer transition-colors hover:bg-muted/50"
          onClick={() => router.push(`/emr/records/${record.id}`)}
        >
          <CardContent className="flex items-center justify-between pt-6">
            <div>
              <div className="flex items-center gap-2">
                <p className="font-medium">{formatDate(record.recordDate)}</p>
                <Badge variant="secondary">{record.recordType.replace("_", " ")}</Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">Dr. {record.doctorName}</p>
              {record.description && <p className="mt-1 text-sm">{record.description}</p>}
            </div>
            {record.diagnoses.length > 0 && (
              <div className="text-right text-sm text-muted-foreground">
                {record.diagnoses.length} diagnos{record.diagnoses.length === 1 ? "is" : "es"}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}