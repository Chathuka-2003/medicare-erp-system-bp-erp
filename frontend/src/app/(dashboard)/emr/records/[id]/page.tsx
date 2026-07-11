"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useMedicalRecord, usePrescriptionByRecord } from "@/hooks/useMedicalRecords";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { VitalsChart } from "@/components/emr/VitalsChart";
import { PrescriptionForm } from "@/components/emr/PrescriptionForm";
import { AllergyPanel } from "@/components/emr/AllergyPanel";
import { formatDate } from "@/lib/utils/format";
import {
  ArrowLeft,
  Pencil,
  Stethoscope,
  FlaskConical,
  Pill,
  AlertTriangle,
} from "lucide-react";

const SEVERITY_BADGE: Record<string, string> = {
  MILD:     "bg-yellow-100 text-yellow-800 border-yellow-300",
  MODERATE: "bg-orange-100 text-orange-800 border-orange-300",
  SEVERE:   "bg-red-100 text-red-800 border-red-300",
};

export default function MedicalRecordDetailPage() {
  const params = useParams();
  const router = useRouter();
  const recordId = params.id as string;

  const { data: record, isLoading } = useMedicalRecord(recordId);
  const { data: prescription, isLoading: prescriptionLoading } = usePrescriptionByRecord(recordId);
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);

  if (isLoading) return <LoadingSpinner />;
  if (!record)   return <p className="p-6">Medical record not found.</p>;

  return (
    <div className="space-y-6 p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="shrink-0">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold">{record.patientName}</h1>
          <p className="text-sm text-muted-foreground">
            {formatDate(record.recordDate)} &mdash; Dr. {record.doctorName}
          </p>
        </div>
        <Badge variant="secondary" className="capitalize">
          {record.recordType.replace(/_/g, " ")}
        </Badge>
        <Button variant="outline" onClick={() => router.push(`/emr/records/${record.id}/edit`)}>
          <Pencil className="mr-2 h-4 w-4" />
          Edit Visit
        </Button>
      </div>

      <Separator />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left sidebar */}
        <div className="space-y-4 lg:col-span-1">
          {/* Visit Summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Stethoscope className="h-4 w-4" />
                Visit Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                <span>Type</span>
                <Badge variant="secondary" className="justify-self-end text-xs">
                  {record.recordType.replace(/_/g, " ")}
                </Badge>
                <span>Patient</span>
                <span className="text-foreground font-medium text-right">{record.patientName}</span>
                <span>Doctor</span>
                <span className="text-foreground font-medium text-right">Dr. {record.doctorName}</span>
                <span>Date</span>
                <span className="text-foreground font-medium text-right">{formatDate(record.recordDate)}</span>
              </div>
              {record.description && (
                <>
                  <Separator />
                  <p className="text-muted-foreground">{record.description}</p>
                </>
              )}
            </CardContent>
          </Card>

          {/* Allergies */}
          <AllergyPanel patientId={record.patientId} />
        </div>

        {/* Right main content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Vitals */}
          <VitalsChart vitals={record.vitals} />

          {/* Diagnoses */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <FlaskConical className="h-4 w-4" />
                Diagnoses
                {record.diagnoses.length > 0 && (
                  <Badge variant="secondary" className="ml-auto">{record.diagnoses.length}</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {record.diagnoses.length === 0 ? (
                <p className="text-sm text-muted-foreground">No diagnoses recorded.</p>
              ) : (
                <div className="space-y-3">
                  {record.diagnoses.map((d, i) => (
                    <div
                      key={d.id ?? i}
                      className="rounded-lg border bg-muted/30 p-4 text-sm"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-semibold">{d.diagnosisName}</p>
                        {d.severity && (
                          <Badge
                            variant="outline"
                            className={`text-xs shrink-0 ${SEVERITY_BADGE[d.severity] ?? ""}`}
                          >
                            <AlertTriangle className="mr-1 h-3 w-3" />
                            {d.severity}
                          </Badge>
                        )}
                      </div>
                      {d.description && (
                        <p className="mt-1 text-muted-foreground">{d.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Prescription */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Pill className="h-4 w-4" />
                  Prescription
                </CardTitle>
                {prescription && !showPrescriptionForm && (
                  <Button variant="outline" size="sm" onClick={() => setShowPrescriptionForm(true)}>
                    <Pencil className="mr-2 h-3 w-3" />
                    Edit
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {prescriptionLoading ? (
                <LoadingSpinner />
              ) : prescription && !showPrescriptionForm ? (
                <div className="space-y-3">
                  {prescription.items.map((item, i) => (
                    <div key={item.id ?? i} className="rounded-lg border bg-muted/30 p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-sm">{item.medicineName}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {item.dosage} &middot; {item.frequency} &middot; {item.duration} days
                          </p>
                        </div>
                        <Badge variant="secondary" className="text-xs">{item.frequency}</Badge>
                      </div>
                    </div>
                  ))}
                  {prescription.notes && (
                    <p className="text-sm text-muted-foreground border-t pt-2">
                      📋 {prescription.notes}
                    </p>
                  )}
                </div>
              ) : (
                <PrescriptionForm
                  medicalRecordId={record.id}
                  prescription={showPrescriptionForm ? prescription : undefined}
                  onSaved={() => setShowPrescriptionForm(false)}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
