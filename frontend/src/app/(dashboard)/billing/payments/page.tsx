"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { EmptyState } from "@/components/common/EmptyState";
import { useInvoicesByPatient, usePaymentsByInvoice } from "@/hooks/useBilling";
import { patientApi } from "@/lib/api/patient.api";
import { useDebounce } from "@/hooks/useDebounce";
import { formatCurrency, formatDateTime } from "@/lib/utils/format";
//import { patientApi } from "@/lib/api/patient.api";

export default function PaymentsPage() {
  const [patientQuery, setPatientQuery] = useState("");
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [selectedInvoiceId, setSelectedInvoiceId] = useState("");
  const debouncedQuery = useDebounce(patientQuery, 400);

  const { data: patientResults } = useQuery({
    queryKey: ["patient-search-lookup", debouncedQuery],
    queryFn: () => patientApi.search({ firstName: debouncedQuery, size: 10 }),
    enabled: debouncedQuery.length > 1,
  });

  const { data: invoices } = useInvoicesByPatient(selectedPatientId || undefined);
  const { data: payments, isLoading } = usePaymentsByInvoice(selectedInvoiceId || undefined);

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-semibold">Payments</h1>

      <Card>
        <CardContent className="space-y-3 pt-6">
          <Input
            placeholder="Search patient by first name..."
            value={patientQuery}
            onChange={(e) => setPatientQuery(e.target.value)}
          />
          <Select value={selectedPatientId} onValueChange={(v) => { setSelectedPatientId(v); setSelectedInvoiceId(""); }}>
            <SelectTrigger className="w-full sm:w-96">
              <SelectValue placeholder="Select a patient" />
            </SelectTrigger>
            <SelectContent>
              {patientResults?.content.map((p) => (
                <SelectItem key={p.id} value={p.id}>{p.firstName} {p.lastName} ({p.patientNumber})</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedPatientId && (
            <Select value={selectedInvoiceId} onValueChange={setSelectedInvoiceId}>
              <SelectTrigger className="w-full sm:w-96">
                <SelectValue placeholder="Select an invoice" />
              </SelectTrigger>
              <SelectContent>
                {invoices?.map((inv) => (
                  <SelectItem key={inv.id} value={inv.id}>{inv.invoiceNumber} — {formatCurrency(inv.totalAmount)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </CardContent>
      </Card>

      {selectedInvoiceId ? (
        isLoading ? (
          <LoadingSpinner />
        ) : payments && payments.length > 0 ? (
          <Card>
            <CardContent className="space-y-2 pt-6">
              {payments.map((p) => (
                <div key={p.id} className="flex items-center justify-between rounded-md border p-3 text-sm">
                  <div>
                    <p className="font-medium">{p.paymentReference}</p>
                    <p className="text-muted-foreground">{p.paymentMethod.replace("_", " ")} · {formatDateTime(p.paymentDate)}</p>
                  </div>
                  <p className="font-medium">{formatCurrency(p.amount)}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        ) : (
          <EmptyState title="No payments found for this invoice" />
        )
      ) : (
        <p className="py-8 text-center text-muted-foreground">Select a patient and invoice above to view payments.</p>
      )}
    </div>
  );
}