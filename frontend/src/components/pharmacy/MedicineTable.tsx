"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common/EmptyState";
import { StockLevelBadge } from "./StockLevelBadge";
import { Medicine } from "@/types/pharmacy.types";
import { formatCurrency } from "@/lib/utils/format";
import { Pencil, Trash2, PackagePlus, Pill, ShieldAlert } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";

interface MedicineTableProps {
  medicines: Medicine[];
  onDelete: (id: string) => void;
}

export function MedicineTable({ medicines, onDelete }: MedicineTableProps) {
  const router = useRouter();

  if (medicines.length === 0) {
    return <EmptyState title="No medicines found" />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {medicines.map((medicine) => {
        const isLowStock = medicine.totalStock <= 15; // Set reorder line limit locally if reorderLevel isn't present
        return (
          <Card key={medicine.id} className="group relative overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 border border-slate-100 bg-white">
            {/* Stock Level color strip */}
            <div className={cn("absolute left-0 top-0 bottom-0 w-1.5", 
              medicine.totalStock === 0 ? "bg-red-500" : isLowStock ? "bg-amber-500" : "bg-emerald-500"
            )} />

            <CardContent className="pt-5 pb-5 pl-6 pr-5 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-2.5 items-center">
                  <div className="h-9 w-9 rounded-xl bg-indigo-50 flex items-center justify-center text-primary shadow-sm">
                    <Pill className="h-4.5 w-4.5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-slate-800 tracking-tight truncate group-hover:text-primary transition-colors">
                      {medicine.medicineName}
                    </h3>
                    <p className="text-[10px] text-slate-450 font-mono mt-0.5">Code: {medicine.medicineCode}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 border-t pt-4 border-slate-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Category</span>
                  <span className="font-semibold text-slate-700 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                    {medicine.category.replace("_", " ")}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Unit Price</span>
                  <span className="font-black text-slate-800">{formatCurrency(medicine.unitPrice)}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Stock Status</span>
                  <StockLevelBadge totalStock={medicine.totalStock} />
                </div>
              </div>

              <div className="flex justify-end gap-1 border-t pt-3 border-slate-100">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1.5 text-slate-655 hover:text-slate-800"
                  onClick={() => router.push(`/pharmacy/medicines/${medicine.id}`)}
                  title="Restock"
                >
                  <PackagePlus className="h-3.5 w-3.5 text-indigo-550" />
                  Restock
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1.5 text-slate-655 hover:text-slate-800"
                  onClick={() => router.push(`/pharmacy/medicines/${medicine.id}/edit`)}
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/5"
                  onClick={() => onDelete(medicine.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
