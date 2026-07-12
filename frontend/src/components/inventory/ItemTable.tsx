"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common/EmptyState";
import { Item } from "@/types/inventory.types";
import { formatCurrency } from "@/lib/utils/format";
import { Pencil, Trash2, Box, Layers, ShieldAlert, BadgeDollarSign } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {items.map((item) => (
        <Card key={item.id} className="group relative overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 border border-slate-100 bg-white">
          {/* Accent indicator if low stock */}
          <div className={cn("absolute left-0 top-0 bottom-0 w-1.5", 
            item.belowReorderLevel ? "bg-amber-500" : "bg-indigo-500/80"
          )} />

          <CardContent className="pt-5 pb-5 pl-6 pr-5 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-2.5 items-center">
                <div className="h-9 w-9 rounded-xl bg-indigo-50 flex items-center justify-center text-primary shadow-sm">
                  <Box className="h-4.5 w-4.5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-slate-800 tracking-tight truncate group-hover:text-primary transition-colors">
                    {item.itemName}
                  </h3>
                  <p className="text-[10px] text-slate-450 font-mono mt-0.5">Code: {item.itemCode}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2 border-t pt-4 border-slate-100">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Category</span>
                <span className="font-semibold text-slate-700 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                  {item.category.replace("_", " ")}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Quantity In Stock</span>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-850">
                    {item.quantityInStock ?? 0} <span className="text-[10px] text-slate-400 font-medium">{item.unit ?? "units"}</span>
                  </span>
                  {item.belowReorderLevel && (
                    <Badge variant="destructive" className="text-[9px] font-black uppercase tracking-wider py-0 px-2 flex items-center gap-0.5">
                      <ShieldAlert className="h-2.5 w-2.5" /> Low
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Purchase Price</span>
                <span className="font-black text-slate-700">{formatCurrency(item.purchasePrice)}</span>
              </div>
            </div>

            <div className="flex justify-end gap-1 border-t pt-3 border-slate-100">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 gap-1.5 text-slate-650 hover:text-slate-800"
                onClick={() => router.push(`/inventory/items/${item.id}`)}
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/5"
                onClick={() => onDelete(item.id)}
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
