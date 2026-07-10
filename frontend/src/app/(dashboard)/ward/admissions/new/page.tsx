import { AdmissionForm } from "@/components/ward/AdmissionForm";

export default function NewAdmissionPage() {
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-semibold">New Admission</h1>
      <AdmissionForm />
    </div>
  );
}