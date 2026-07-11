"use client";

import { useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/StatusBadge";
import { EmptyState } from "@/components/common/EmptyState";
import { Invoice } from "@/types/billing.types";
import { formatCurrency } from "@/lib/utils/format";
import { getInvoiceStatusVariant } from "@/lib/utils/invoice-status";
import { Eye } from "lucide-react";

interface InvoiceTableProps {
  invoices: Invoice[];
}

export function InvoiceTable({ invoices }: InvoiceTableProps) {
  const router = useRouter();

  if (invoices.length === 0) {
    return <EmptyState title="No invoices found" />;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice No.</TableHead>
          <TableHead>Patient</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Paid</TableHead>
          <TableHead>Balance</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
            <TableCell>{invoice.patientName}</TableCell>
            <TableCell>{formatCurrency(invoice.totalAmount)}</TableCell>
            <TableCell>{formatCurrency(invoice.paidAmount)}</TableCell>
            <TableCell>{formatCurrency(invoice.balanceAmount)}</TableCell>
            <TableCell>
              <StatusBadge label={invoice.status.replace("_", " ")} variant={getInvoiceStatusVariant(invoice.status)} />
            </TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="icon" onClick={() => router.push(`/billing/invoices/${invoice.id}`)}>
                <Eye className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}