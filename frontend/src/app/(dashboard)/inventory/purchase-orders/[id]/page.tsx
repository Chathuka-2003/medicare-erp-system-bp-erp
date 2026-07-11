"use client";

import { useParams } from "next/navigation";
import { usePurchaseOrder, useReceivePurchaseOrder, useCancelPurchaseOrder } from "@/hooks/useInventory";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/StatusBadge";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { formatCurrency, formatDate } from "@/lib/utils/format";

export default function PurchaseOrderDetailPage() {
  const params = useParams();
  const { data: po, isLoading } = usePurchaseOrder(params.id as string);
  const receiveMutation = useReceivePurchaseOrder();
  const cancelMutation = useCancelPurchaseOrder();

  if (isLoading) return <LoadingSpinner />;
  if (!po) return <p className="p-6">Purchase order not found.</p>;

  const isPending = po.status === "PENDING";

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{po.purchaseOrderNumber}</h1>
          <p className="text-sm text-muted-foreground">{po.supplierName} · {formatDate(po.orderDate)}</p>
          <div className="mt-2"><StatusBadge label={po.status} /></div>
        </div>
        {isPending && (
          <div className="flex gap-2">
            <Button variant="destructive" onClick={() => cancelMutation.mutate(po.id)}>Cancel</Button>
            <Button onClick={() => receiveMutation.mutate(po.id)}>Receive Stock</Button>
          </div>
        )}
      </div>

      <Card>
        <CardHeader><CardTitle>Items</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {po.items.map((item, i) => (
            <div key={item.id ?? i} className="flex items-center justify-between rounded-md border p-3 text-sm">
              <p>{item.itemName} × {item.quantity}</p>
              <p className="font-medium">{formatCurrency(item.totalPrice ?? item.quantity * item.unitPrice)}</p>
            </div>
          ))}
          <div className="flex justify-end border-t pt-3">
            <p className="text-lg font-semibold">Total: {formatCurrency(po.totalAmount)}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
