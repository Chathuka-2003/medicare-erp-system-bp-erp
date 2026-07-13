"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useInvoice, usePaymentsByInvoice, useCancelInvoice } from "@/hooks/useBilling";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/StatusBadge";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { InvoicePrintView } from "@/components/billing/InvoicePrintView";
import { PaymentForm } from "@/components/billing/PaymentForm";
import { formatCurrency, formatDateTime } from "@/lib/utils/format";
import { getInvoiceStatusVariant } from "@/lib/utils/invoice-status";
import { Pencil, Printer } from "lucide-react";
//import { getInvoiceStatusVariant } from "@/lib/utils/invoice-status";
//import { Pencil, Printer } from "lucide-react";

export default function InvoiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const invoiceId = params.id as string;

  const { data: invoice, isLoading } = useInvoice(invoiceId);
  const { data: payments, isLoading: paymentsLoading } = usePaymentsByInvoice(invoiceId);
  const cancelMutation = useCancelInvoice();
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  if (isLoading) return <LoadingSpinner />;
  if (!invoice) return <p className="p-6">Invoice not found.</p>;

  const canRecordPayment = invoice.balanceAmount > 0 && invoice.status !== "CANCELLED";

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Invoice {invoice.invoiceNumber}</h1>
          <StatusBadge label={invoice.status.replace("_", " ")} variant={getInvoiceStatusVariant(invoice.status)} />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.print()}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          {invoice.status !== "PAID" && invoice.status !== "CANCELLED" && (
            <Button variant="outline" onClick={() => router.push(`/billing/invoices/${invoice.id}/edit`)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
          )}
          {invoice.status !== "CANCELLED" && invoice.status !== "PAID" && (
            <Button variant="destructive" onClick={() => cancelMutation.mutate(invoice.id)}>
              Cancel Invoice
            </Button>
          )}
        </div>
      </div>

      <InvoicePrintView invoice={invoice} />

      <Card>
        <CardHeader><CardTitle>Payments</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {paymentsLoading ? (
            <LoadingSpinner />
          ) : payments && payments.length > 0 ? (
            <div className="space-y-2">
              {payments.map((p) => (
                <div key={p.id} className="flex items-center justify-between rounded-md border p-3 text-sm">
                  <div>
                    <p className="font-medium">{p.paymentReference}</p>
                    <p className="text-muted-foreground">{p.paymentMethod.replace("_", " ")} · {formatDateTime(p.paymentDate)}</p>
                  </div>
                  <p className="font-medium">{formatCurrency(p.amount)}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No payments recorded yet.</p>
          )}

          {canRecordPayment && (
            showPaymentForm ? (
              <PaymentForm
                invoiceId={invoice.id}
                maxAmount={invoice.balanceAmount}
                onSaved={() => setShowPaymentForm(false)}
              />
            ) : (
              <Button variant="outline" size="sm" onClick={() => setShowPaymentForm(true)}>
                Record Payment
              </Button>
            )
          )}
        </CardContent>
      </Card>
    </div>
  );
}