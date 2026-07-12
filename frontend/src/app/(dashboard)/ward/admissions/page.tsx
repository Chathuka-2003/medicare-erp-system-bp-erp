"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { EmptyState } from "@/components/common/EmptyState";
import { useCurrentAdmissions, useDischargePatient } from "@/hooks/useWard";
import { formatDateTime } from "@/lib/utils/format";
import { Plus } from "lucide-react";
import { WardTabs } from "@/components/ward/WardTabs";

export default function AdmissionsPage() {
  const router = useRouter();
  const { data: admissions, isLoading } = useCurrentAdmissions();
  const dischargeMutation = useDischargePatient();

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Current Admissions</h1>
        <Button onClick={() => router.push("/ward/admissions/new")}>
          <Plus className="mr-2 h-4 w-4" />
          New Admission
        </Button>
      </div>

      <WardTabs />

      <Card>
        <CardContent className="pt-6">
          {isLoading ? (
            <LoadingSpinner />
          ) : !admissions || admissions.length === 0 ? (
            <EmptyState title="No current admissions" />
          ) : (
            <div className="space-y-3">
              {admissions.map((a) => (
                <div key={a.id} className="flex items-center justify-between rounded-md border p-3">
                  <div>
                    <p className="font-medium">{a.patientName} — {a.admissionNumber}</p>
                    <p className="text-sm text-muted-foreground">
                      {a.wardName}, Bed {a.bedNumber} · Dr. {a.doctorName} · Admitted {formatDateTime(a.admissionDate)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => router.push(`/ward/admissions/${a.id}`)}>
                      View
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => dischargeMutation.mutate(a.id)}>
                      Discharge
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
