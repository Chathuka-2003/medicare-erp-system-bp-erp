import { StaffForm } from "@/components/staff/StaffForm";

export default function NewStaffPage() {
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-semibold">New Staff Member</h1>
      <StaffForm />
    </div>
  );
}