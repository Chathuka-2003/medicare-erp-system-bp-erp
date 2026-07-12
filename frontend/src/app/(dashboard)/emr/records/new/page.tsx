"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { MedicalRecordForm } from "@/components/emr/MedicalRecordForm";

function NewMedicalRecordContent() {
  const searchParams = useSearchParams();
  const patientId = searchParams.get("patientId") ?? undefined;
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-semibold">New Medical Record</h1>
      <MedicalRecordForm presetPatientId={patientId} />
    </div>
  );
}

export default function NewMedicalRecordPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <NewMedicalRecordContent />
    </Suspense>
  );
}
