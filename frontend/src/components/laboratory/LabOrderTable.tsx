"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common/EmptyState";
import { LabOrder } from "@/types/laboratory.types";
import { formatDateTime } from "@/lib/utils/format";
import { getLabStatusVariant } from "@/lib/utils/lab-status";
import { Eye, FlaskConical, Stethoscope, Calendar, Activity } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";

interface LabOrderTableProps {
  orders: LabOrder[];
}

const LAB_STATUS_STYLES: Record<string, { bg: string; text: string; border: string; strip: string }> = {
  COMPLETED: { bg: "bg-emerald-50 text-emerald-700", text: "text-emerald-700", border: "border-emerald-200", strip: "bg-emerald-500" },
  PENDING: { bg: "bg-amber-50 text-amber-700", text: "text-amber-700", border: "border-amber-200", strip: "bg-amber-500" },
  IN_PROGRESS: { bg: "bg-blue-50 text-blue-700", text: "text-blue-700", border: "border-blue-200", strip: "bg-blue-500" },
  CANCELLED: { bg: "bg-red-50 text-red-700", text: "text-red-700", border: "border-red-200", strip: "bg-red-500" },
};

export function LabOrderTable({ orders }: LabOrderTableProps) {
  const router = useRouter();

  if (orders.length === 0) {
    return <EmptyState title="No lab orders found" />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {orders.map((order) => {
        const style = LAB_STATUS_STYLES[order.status] || { bg: "bg-slate-50 text-slate-650", border: "border-slate-200", strip: "bg-slate-400" };
        return (
          <Card key={order.id} className="group relative overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 border border-slate-100 bg-white">
            {/* Status indicator bar */}
            <div className={cn("absolute left-0 top-0 bottom-0 w-1.5", style.strip)} />

            <CardContent className="pt-5 pb-5 pl-6 pr-5 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-2.5 items-center">
                  <div className="h-9 w-9 rounded-xl bg-indigo-50 flex items-center justify-center text-primary shadow-sm">
                    <FlaskConical className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 tracking-tight group-hover:text-primary transition-colors">
                      {order.orderNumber}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-medium">Lab Specimen Order</p>
                  </div>
                </div>
                <span className={cn("text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full border", style.bg, style.border)}>
                  {order.status.replace("_", " ")}
                </span>
              </div>

              <div className="space-y-2 border-t pt-4 border-slate-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium flex items-center gap-1">
                    <Stethoscope className="h-3.5 w-3.5 text-slate-450 shrink-0" />
                    Ordering Doctor
                  </span>
                  <span className="font-semibold text-slate-800">
                    Dr. {order.doctorName}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-slate-455 shrink-0" />
                    Ordered At
                  </span>
                  <span className="font-semibold text-slate-700">
                    {formatDateTime(order.orderDate)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium flex items-center gap-1">
                    <Activity className="h-3.5 w-3.5 text-slate-455 shrink-0" />
                    Tests Count
                  </span>
                  <Badge variant="secondary" className="font-extrabold text-[10px] bg-slate-100 hover:bg-slate-100 text-slate-650">
                    {order.orderItems?.length ?? 0} Test{order.orderItems?.length !== 1 ? "s" : ""}
                  </Badge>
                </div>
              </div>

              <div className="flex justify-end border-t pt-3 border-slate-100">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1.5 text-indigo-650 hover:text-indigo-800 hover:bg-indigo-50/50"
                  onClick={() => router.push(`/laboratory/orders/${order.id}`)}
                >
                  <Eye className="h-3.5 w-3.5" />
                  View Results
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
