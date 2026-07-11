"use client";

import { useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/StatusBadge";
import { EmptyState } from "@/components/common/EmptyState";
import { LabOrder } from "@/types/laboratory.types";
import { formatDateTime } from "@/lib/utils/format";
import { getLabStatusVariant } from "@/lib/utils/lab-status";
import { Eye } from "lucide-react";

interface LabOrderTableProps {
  orders: LabOrder[];
}

export function LabOrderTable({ orders }: LabOrderTableProps) {
  const router = useRouter();

  if (orders.length === 0) {
    return <EmptyState title="No lab orders found" />;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order No.</TableHead>
          <TableHead>Doctor</TableHead>
          <TableHead>Order Date</TableHead>
          <TableHead>Tests</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell className="font-medium">{order.orderNumber}</TableCell>
            <TableCell>Dr. {order.doctorName}</TableCell>
            <TableCell>{formatDateTime(order.orderDate)}</TableCell>
            <TableCell>{order.orderItems.length}</TableCell>
            <TableCell>
              <StatusBadge label={order.status.replace("_", " ")} variant={getLabStatusVariant(order.status)} />
            </TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="icon" onClick={() => router.push(`/laboratory/orders/${order.id}`)}>
                <Eye className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
