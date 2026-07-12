"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common/EmptyState";
import { Invoice } from "@/types/billing.types";
import { formatCurrency } from "@/lib/utils/format";
import { getInvoiceStatusVariant } from "@/lib/utils/invoice-status";
import { Eye, Receipt, User, DollarSign, Wallet, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";

interface InvoiceTableProps {
  invoices: Invoice[];
}

const INVOICE_STATUS_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  PAID: { bg: "bg-emerald-50 text-emerald-700", text: "text-emerald-700", border: "border-emerald-200" },
  UNPAID: { bg: "bg-rose-50 text-rose-700", text: "text-rose-700", border: "border-rose-200" },
  PARTIALLY_PAID: { bg: "bg-amber-50 text-amber-700", text: "text-amber-700", border: "border-amber-200" },
  VOID: { bg: "bg-slate-50 text-slate-600", text: "text-slate-650", border: "border-slate-200" },
};

export function InvoiceTable({ invoices }: InvoiceTableProps) {
  const router = useRouter();

  if (invoices.length === 0) {
    return <EmptyState title="No invoices found" />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {invoices.map((invoice) => {
        const statusStyle = INVOICE_STATUS_STYLES[invoice.status] || { bg: "bg-slate-50 text-slate-600", border: "border-slate-250" };
        return (
          <Card key={invoice.id} className="group relative overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 border border-slate-100 bg-white">
            {/* Accent stripe */}
            <div className={cn("absolute left-0 top-0 bottom-0 w-1.5", 
              invoice.status === "PAID" ? "bg-emerald-500" : invoice.status === "PARTIALLY_PAID" ? "bg-amber-500" : "bg-rose-500"
            )} />

            <CardContent className="pt-5 pb-5 pl-6 pr-5 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-2.5 items-center">
                  <div className="h-9 w-9 rounded-xl bg-indigo-50 flex items-center justify-center text-primary shadow-sm">
                    <Receipt className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 tracking-tight group-hover:text-primary transition-colors">
                      {invoice.invoiceNumber}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-medium">Invoice Reference</p>
                  </div>
                </div>
                <span className={cn("text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full border", statusStyle.bg, statusStyle.border)}>
                  {invoice.status.replace("_", " ")}
                </span>
              </div>

              {/* Patient info */}
              <div className="flex items-center gap-2 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100/30">
                <User className="h-4 w-4 text-slate-450 shrink-0" />
                <span className="text-xs font-bold text-slate-700 truncate">{invoice.patientName}</span>
              </div>

              {/* Financial values */}
              <div className="grid grid-cols-3 gap-2 border-t pt-4 border-slate-100">
                <div className="text-center">
                  <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">Total</p>
                  <p className="text-sm font-black text-slate-800 mt-0.5">{formatCurrency(invoice.totalAmount)}</p>
                </div>
                <div className="text-center">
                  <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">Paid</p>
                  <p className="text-sm font-black text-emerald-650 mt-0.5">{formatCurrency(invoice.paidAmount)}</p>
                </div>
                <div className="text-center">
                  <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">Balance</p>
                  <p className={cn("text-sm font-black mt-0.5", invoice.balanceAmount > 0 ? "text-rose-600" : "text-slate-500")}>
                    {formatCurrency(invoice.balanceAmount)}
                  </p>
                </div>
              </div>

              {/* Action row */}
              <div className="flex justify-end border-t pt-3 border-slate-100">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1.5 text-indigo-650 hover:text-indigo-800 hover:bg-indigo-50/50"
                  onClick={() => router.push(`/billing/invoices/${invoice.id}`)}
                >
                  <Eye className="h-3.5 w-3.5" />
                  View Invoice
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
