import { LabTestForm } from "@/components/laboratory/LabTestForm";

export default function NewLabTestPage() {
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-semibold">New Lab Test</h1>
      <LabTestForm />
    </div>
  );
}