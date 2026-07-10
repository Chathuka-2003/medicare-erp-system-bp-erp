import { SupplierForm } from "@/components/inventory/SupplierForm";

export default function NewSupplierPage() {
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-semibold">New Supplier</h1>
      <SupplierForm />
    </div>
  );
}