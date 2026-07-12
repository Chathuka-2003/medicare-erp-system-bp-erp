"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { Pagination } from "@/components/common/Pagination";
import { ItemTable } from "@/components/inventory/ItemTable";
import { useItems, useDeleteItem } from "@/hooks/useInventory";
import { usePagination } from "@/hooks/usePagination";
import { Plus } from "lucide-react";

export default function ItemsPage() {
  const router = useRouter();
  const { page, size, setPage } = usePagination(0, 10);
  const { data, isLoading } = useItems({ page, size });
  const deleteMutation = useDeleteItem();

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Inventory Items</h1>
        <Button onClick={() => router.push("/inventory/items/new")}>
          <Plus className="mr-2 h-4 w-4" />
          New Item
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <>
              <ItemTable
                items={data?.content ?? []}
                onDelete={(id) => {
                  if (confirm("Delete this item?")) deleteMutation.mutate(id);
                }}
              />
              {data && <Pagination page={data.pageNumber} totalPages={data.totalPages} onPageChange={setPage} />}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
