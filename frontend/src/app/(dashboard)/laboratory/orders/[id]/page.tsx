"use client";

import { useParams } from "next/navigation";
import { useLabOrder } from "@/hooks/useLaboratory";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/common/StatusBadge";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { LabResultView } from "@/components/laboratory/LabResultView";
import { formatDateTime } from "@/lib/utils/format";
import { getLabStatusVariant } from "@/lib/utils/lab-status";

export default function LabOrderDetailPage() {
  const params = useParams();
  const { data: order, isLoading } = useLabOrder(params.id as string);

  if (isLoading) return <LoadingSpinner />;
  if (!order) return <p className="p-6">Lab order not found.</p>;

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Order {order.orderNumber}</h1>
        <p className="text-sm text-muted-foreground">
          {order.patientName} · Dr. {order.doctorName} · {formatDateTime(order.orderDate)}
        </p>
        <div className="mt-2">
          <StatusBadge label={order.status.replace("_", " ")} variant={getLabStatusVariant(order.status)} />
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle>Test Results</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {order.orderItems.map((item) => (
            <LabResultView
              key={item.id}
              labOrderItemId={item.id}
              testName={item.testName}
              resultAvailable={item.resultAvailable}
            />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
