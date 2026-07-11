"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { EmptyState } from "@/components/common/EmptyState";
import { useSuppliers, useDeleteSupplier } from "@/hooks/useInventory";
import { Plus, Trash2 } from "lucide-react";

export default function SuppliersPage() {
  const router = useRouter();
  const { data: suppliers, isLoading } = useSuppliers();
  const deleteMutation = useDeleteSupplier();

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Suppliers</h1>
        <Button onClick={() => router.push("/inventory/suppliers/new")}>
          <Plus className="mr-2 h-4 w-4" />
          New Supplier
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading ? (
            <LoadingSpinner />
          ) : !suppliers || suppliers.length === 0 ? (
            <EmptyState title="No suppliers found" />
          ) : (
            <div className="space-y-3">
              {suppliers.map((s) => (
                <div key={s.id} className="flex items-center justify-between rounded-md border p-3">
                  <div>
                    <p className="font-medium">{s.supplierName}</p>
                    <p className="text-sm text-muted-foreground">{s.contactPerson ?? "—"} · {s.phone ?? "—"} · {s.email ?? "—"}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline" size="sm"
                      onClick={() => router.push(`/inventory/purchase-orders?supplierId=${s.id}`)}
                    >
                      View POs
                    </Button>
                    <Button
                      variant="ghost" size="icon"
                      onClick={() => {
                        if (confirm("Delete this supplier?")) deleteMutation.mutate(s.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
