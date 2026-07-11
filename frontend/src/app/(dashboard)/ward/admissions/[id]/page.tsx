"use client";

import { useParams } from "next/navigation";
import { useAdmission, useDischargePatient } from "@/hooks/useWard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { formatDateTime } from "@/lib/utils/format";

export default function AdmissionDetailPage() {
  const params = useParams();
  const { data: admission, isLoading } = useAdmission(params.id as string);
  const dischargeMutation = useDischargePatient();

  if (isLoading) return <LoadingSpinner />;
  if (!admission) return <p className="p-6">Admission not found.</p>;

  const isDischarged = !!admission.dischargeDate;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Admission {admission.admissionNumber}</h1>
        {!isDischarged && (
          <Button variant="destructive" onClick={() => dischargeMutation.mutate(admission.id)}>
            Discharge Patient
          </Button>
        )}
      </div>

      <Card>
        <CardHeader><CardTitle>Details</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p><span className="text-muted-foreground">Patient:</span> {admission.patientName}</p>
          <p><span className="text-muted-foreground">Doctor:</span> Dr. {admission.doctorName}</p>
          <p><span className="text-muted-foreground">Ward / Bed:</span> {admission.wardName}, Bed {admission.bedNumber}</p>
          <p><span className="text-muted-foreground">Admission Date:</span> {formatDateTime(admission.admissionDate)}</p>
          {admission.dischargeDate && (
            <p><span className="text-muted-foreground">Discharge Date:</span> {formatDateTime(admission.dischargeDate)}</p>
          )}
          <p><span className="text-muted-foreground">Diagnosis:</span> {admission.diagnosis ?? "—"}</p>
          <p><span className="text-muted-foreground">Remarks:</span> {admission.remarks ?? "—"}</p>
        </CardContent>
      </Card>
    </div>
  );
}
