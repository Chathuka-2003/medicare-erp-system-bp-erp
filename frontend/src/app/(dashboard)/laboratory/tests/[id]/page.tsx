"use client";

import { useParams } from "next/navigation";
import { useLabTest } from "@/hooks/useLaboratory";
import { LabTestForm } from "@/components/laboratory/LabTestForm";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

export default function EditLabTestPage() {
  const params = useParams();
  const { data: labTest, isLoading } = useLabTest(params.id as string);

  if (isLoading) return <LoadingSpinner />;
  if (!labTest) return <p className="p-6">Lab test not found.</p>;

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-semibold">Edit Lab Test</h1>
      <LabTestForm labTest={labTest} />
    </div>
  );
}