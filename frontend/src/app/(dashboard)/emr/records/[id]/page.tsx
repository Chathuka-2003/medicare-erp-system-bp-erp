"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useMedicalRecord, usePrescriptionByRecord } from "@/hooks/useMedicalRecords";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { VitalsChart } from "@/components/emr/VitalsChart";
import { PrescriptionForm } from "@/components/emr/PrescriptionForm";
import { formatDate } from "@/lib/utils/format";
import { Pencil } from "lucide-react";

export default function MedicalRecordDetailPage() {
  const params = useParams();
  const router = useRouter();
  const recordId = params.id as string;

  const { data: record, isLoading } = useMedicalRecord(recordId);
  const { data: prescription, isLoading: prescriptionLoading } = usePrescriptionByRecord(recordId);
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);

  if (isLoading) return <LoadingSpinner />;
  if (!record) return <p className="p-6">Medical record not found.</p>;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{record.patientName}</h1>
          <p className="text-sm text-muted-foreground">{formatDate(record.recordDate)} — Dr. {record.doctorName}</p>
        </div>
        <Button variant="outline" onClick={() => router.push(`/emr/records/${record.id}/edit`)}>
          <Pencil className="mr-2 h-4 w-4" />
          Edit Visit
        </Button>
      </div>

      <Card>
        <CardHeader><CardTitle>Visit Summary</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p><Badge variant="secondary">{record.recordType.replace("_", " ")}</Badge></p>
          <p>{record.description ?? "No description provided."}</p>
        </CardContent>
      </Card>

      <VitalsChart vitals={record.vitals} />

      <Card>
        <CardHeader><CardTitle>Diagnoses</CardTitle></CardHeader>
        <CardContent>
          {record.diagnoses.length === 0 ? (
            <p className="text-sm text-muted-foreground">No diagnoses recorded.</p>
          ) : (
            <div className="space-y-3">
              {record.diagnoses.map((d, i) => (
                <div key={d.id ?? i} className="rounded-md border p-3 text-sm">
                  <p className="font-medium">{d.diagnosisName} {d.severity && <Badge variant="outline" className="ml-2">{d.severity}</Badge>}</p>
                  {d.description && <p className="mt-1 text-muted-foreground">{d.description}</p>}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Prescription</CardTitle></CardHeader>
        <CardContent>
          {prescriptionLoading ? (
            <LoadingSpinner />
          ) : prescription && !showPrescriptionForm ? (
            <div className="space-y-3">
              {prescription.items.map((item, i) => (
                <div key={item.id ?? i} className="rounded-md border p-3 text-sm">
                  <p className="font-medium">{item.medicineName}</p>
                  <p className="text-muted-foreground">{item.dosage} · {item.frequency} · {item.duration} days</p>
                </div>
              ))}
              {prescription.notes && <p className="text-sm text-muted-foreground">Notes: {prescription.notes}</p>}
              <Button variant="outline" size="sm" onClick={() => setShowPrescriptionForm(true)}>Edit Prescription</Button>
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
  );
}