import { InvoiceStatus } from "@/types/billing.types";

export function getInvoiceStatusVariant(status: InvoiceStatus): "default" | "success" | "warning" | "destructive" {
  switch (status) {
    case InvoiceStatus.PAID:
      return "success";
    case InvoiceStatus.ISSUED:
    case InvoiceStatus.PARTIALLY_PAID:
      return "warning";
    case InvoiceStatus.OVERDUE:
    case InvoiceStatus.CANCELLED:
      return "destructive";
    default:
      return "default";
  }
}