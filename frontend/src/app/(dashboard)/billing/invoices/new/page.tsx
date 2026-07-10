import { InvoiceForm } from "@/components/billing/InvoiceForm";

export default function NewInvoicePage() {
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-semibold">New Invoice</h1>
      <InvoiceForm />
    </div>
  );
}