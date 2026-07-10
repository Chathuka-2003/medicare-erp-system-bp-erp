import { PurchaseOrderForm } from "@/components/inventory/PurchaseOrderForm";

export default function NewPurchaseOrderPage() {
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-semibold">New Purchase Order</h1>
      <PurchaseOrderForm />
    </div>
  );
}