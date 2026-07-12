"use client";

import { useParams } from "next/navigation";
import { usePatient } from "@/hooks/usePatients";
import { PatientForm } from "@/components/patients/PatientForm";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

export default function EditPatientPage() {
  const params = useParams();
  const { data: patient, isLoading } = usePatient(params.id as string);

  if (isLoading) return <LoadingSpinner />;
  if (!patient) return <p className="p-6">Patient not found.</p>;

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-semibold">Edit Patient</h1>
      <PatientForm patient={patient} />
    </div>
  );
}