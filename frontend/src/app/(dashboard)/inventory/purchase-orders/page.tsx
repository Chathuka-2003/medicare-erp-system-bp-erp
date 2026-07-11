"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { EmptyState } from "@/components/common/EmptyState";
import { StatusBadge } from "@/components/common/StatusBadge";
import { useSuppliers, usePurchaseOrdersBySupplier } from "@/hooks/useInventory";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import { Plus } from "lucide-react";

export default function PurchaseOrdersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [supplierId, setSupplierId] = useState(searchParams.get("supplierId") ?? "");

  const { data: suppliers } = useSuppliers();
  const { data: orders, isLoading } = usePurchaseOrdersBySupplier(supplierId || undefined);

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Purchase Orders</h1>
        <Button onClick={() => router.push("/inventory/purchase-orders/new")}>
          <Plus className="mr-2 h-4 w-4" />
          New Purchase Order
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Select value={supplierId} onValueChange={setSupplierId}>
            <SelectTrigger className="w-full sm:w-80">
              <SelectValue placeholder="Select a supplier to view orders" />
            </SelectTrigger>
            <SelectContent>
              {suppliers?.map((s) => (
                <SelectItem key={s.id} value={s.id}>{s.supplierName}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {supplierId ? (
        isLoading ? (
          <LoadingSpinner />
        ) : !orders || orders.length === 0 ? (
          <EmptyState title="No purchase orders found for this supplier" />
        ) : (
          <div className="space-y-3">
            {orders.map((po) => (
              <Card key={po.id} className="cursor-pointer" onClick={() => router.push(`/inventory/purchase-orders/${po.id}`)}>
                <CardContent className="flex items-center justify-between pt-6">
                  <div>
                    <p className="font-medium">{po.purchaseOrderNumber}</p>
                    <p className="text-sm text-muted-foreground">{formatDate(po.orderDate)} · {formatCurrency(po.totalAmount)}</p>
                  </div>
                  <StatusBadge label={po.status} />
                </CardContent>
              </Card>
            ))}
          </div>
        )
      ) : (
        <p className="py-8 text-center text-muted-foreground">Select a supplier above to view their purchase orders.</p>
      )}
    </div>
  );
}
