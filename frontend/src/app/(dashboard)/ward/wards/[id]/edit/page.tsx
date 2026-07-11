"use client";

import { useParams } from "next/navigation";
import { useWard } from "@/hooks/useWard";
import { WardForm } from "@/components/ward/WardForm";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

export default function EditWardPage() {
  const params = useParams();
  const { data: ward, isLoading } = useWard(params.id as string);

  if (isLoading) return <LoadingSpinner />;
  if (!ward) return <p className="p-6">Ward not found.</p>;

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-semibold">Edit Ward</h1>
      <WardForm ward={ward} />
    </div>
  );
}
