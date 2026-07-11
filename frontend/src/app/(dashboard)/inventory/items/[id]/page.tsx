"use client";

import { useParams } from "next/navigation";
import { useItem } from "@/hooks/useInventory";
import { ItemForm } from "@/components/inventory/ItemForm";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

export default function ItemDetailPage() {
  const params = useParams();
  const { data: item, isLoading } = useItem(params.id as string);

  if (isLoading) return <LoadingSpinner />;
  if (!item) return <p className="p-6">Item not found.</p>;

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-semibold">Edit Item</h1>
      <ItemForm item={item} />
    </div>
  );
}
