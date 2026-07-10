"use client";

import { useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/StatusBadge";
import { EmptyState } from "@/components/common/EmptyState";
import { Item } from "@/types/inventory.types";
import { formatCurrency } from "@/lib/utils/format";
import { Pencil, Trash2 } from "lucide-react";

interface ItemTableProps {
  items: Item[];
  onDelete: (id: string) => void;
}

export function ItemTable({ items, onDelete }: ItemTableProps) {
  const router = useRouter();

  if (items.length === 0) {
    return <EmptyState title="No items found" />;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Code</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Stock</TableHead>
          <TableHead>Purchase Price</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">{item.itemCode}</TableCell>
            <TableCell>{item.itemName}</TableCell>
            <TableCell>{item.category.replace("_", " ")}</TableCell>
            <TableCell>
              {item.quantityInStock ?? 0} {item.unit ?? ""}
              {item.belowReorderLevel && <StatusBadge label="Low" variant="warning" className="ml-2" />}
            </TableCell>
            <TableCell>{formatCurrency(item.purchasePrice)}</TableCell>
            <TableCell className="text-right space-x-1">
              <Button variant="ghost" size="icon" onClick={() => router.push(`/inventory/items/${item.id}`)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => onDelete(item.id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
