import { WardForm } from "@/components/ward/WardForm";

export default function NewWardPage() {
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-semibold">New Ward</h1>
      <WardForm />
    </div>
  );
}
