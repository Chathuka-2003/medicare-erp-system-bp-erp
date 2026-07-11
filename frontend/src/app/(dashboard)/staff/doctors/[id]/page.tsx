"use client";

import { useParams } from "next/navigation";
import { useDoctor } from "@/hooks/useStaff";
import { DoctorForm } from "@/components/staff/DoctorForm";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

export default function EditDoctorPage() {
  const params = useParams();
  const { data: doctor, isLoading } = useDoctor(params.id as string);

  if (isLoading) return <LoadingSpinner />;
  if (!doctor) return <p className="p-6">Doctor not found.</p>;

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-semibold">Edit Doctor</h1>
      <DoctorForm doctor={doctor} />
    </div>
  );
}