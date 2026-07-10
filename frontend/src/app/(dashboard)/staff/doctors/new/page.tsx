import { DoctorForm } from "@/components/staff/DoctorForm";

export default function NewDoctorPage() {
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-semibold">New Doctor</h1>
      <DoctorForm />
    </div>
  );
}