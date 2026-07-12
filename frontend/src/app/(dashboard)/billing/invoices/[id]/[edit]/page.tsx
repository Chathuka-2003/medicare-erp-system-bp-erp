"use client";

import { useParams } from "next/navigation";
import { useInvoice } from "@/hooks/useBilling";
import { InvoiceForm } from "@/components/billing/InvoiceForm";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

export default function EditInvoicePage() {
  const params = useParams();
  const { data: invoice, isLoading } = useInvoice(params.id as string);

  if (isLoading) return <LoadingSpinner />;
  if (!invoice) return <p className="p-6">Invoice not found.</p>;

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-semibold">Edit Invoice</h1>
      <InvoiceForm invoice={invoice} />
    </div>
  );
}