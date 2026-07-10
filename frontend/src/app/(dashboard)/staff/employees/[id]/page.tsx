"use client";

import { useParams } from "next/navigation";
import { useStaffMember } from "@/hooks/useStaff";
import { StaffForm } from "@/components/staff/StaffForm";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

export default function EditStaffPage() {
  const params = useParams();
  const { data: staff, isLoading } = useStaffMember(params.id as string);

  if (isLoading) return <LoadingSpinner />;
  if (!staff) return <p className="p-6">Staff member not found.</p>;

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-semibold">Edit Staff Member</h1>
      <StaffForm staff={staff} />
    </div>
  );
}