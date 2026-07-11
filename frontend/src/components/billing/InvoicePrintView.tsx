import { Invoice } from "@/types/billing.types";
import { formatCurrency, formatDate } from "@/lib/utils/format";

interface InvoicePrintViewProps {
  invoice: Invoice;
}

export function InvoicePrintView({ invoice }: InvoicePrintViewProps) {
  return (
    <div className="print:block space-y-4 rounded-md border p-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h2 className="text-xl font-bold">Invoice {invoice.invoiceNumber}</h2>
          <p className="text-sm text-muted-foreground">Date: {formatDate(invoice.invoiceDate)}</p>
        </div>
        <div className="text-right">
          <p className="font-medium">{invoice.patientName}</p>
          {invoice.dueDate && <p className="text-sm text-muted-foreground">Due: {formatDate(invoice.dueDate)}</p>}
        </div>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left">
            <th className="py-2">Item</th>
            <th className="py-2 text-right">Qty</th>
            <th className="py-2 text-right">Unit Price</th>
            <th className="py-2 text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item, i) => (
            <tr key={item.id ?? i} className="border-b">
              <td className="py-2">{item.itemName}</td>
              <td className="py-2 text-right">{item.quantity}</td>
              <td className="py-2 text-right">{formatCurrency(item.unitPrice)}</td>
              <td className="py-2 text-right">{formatCurrency(item.totalPrice ?? item.quantity * item.unitPrice)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end">
        <div className="w-64 space-y-1 text-sm">
          <div className="flex justify-between"><span>Total</span><span>{formatCurrency(invoice.totalAmount)}</span></div>
          <div className="flex justify-between"><span>Paid</span><span>{formatCurrency(invoice.paidAmount)}</span></div>
          <div className="flex justify-between border-t pt-1 font-semibold"><span>Balance</span><span>{formatCurrency(invoice.balanceAmount)}</span></div>
        </div>
      </div>
    </div>
  );
}