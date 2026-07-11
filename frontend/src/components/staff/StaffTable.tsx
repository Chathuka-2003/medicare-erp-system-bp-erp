"use client";

import { useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/StatusBadge";
import { EmptyState } from "@/components/common/EmptyState";
import { Staff } from "@/types/staff.types";
import { Pencil, Trash2, UserX } from "lucide-react";

interface StaffTableProps {
  staff: Staff[];
  onDeactivate: (id: string) => void;
  onDelete: (id: string) => void;
}

export function StaffTable({ staff, onDeactivate, onDelete }: StaffTableProps) {
  const router = useRouter();

  if (staff.length === 0) {
    return <EmptyState title="No staff members found" />;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Employee No.</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Department</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {staff.map((member) => (
          <TableRow key={member.id}>
            <TableCell className="font-medium">{member.firstName} {member.lastName ?? ""}</TableCell>
            <TableCell>{member.employeeNumber}</TableCell>
            <TableCell>{member.role}</TableCell>
            <TableCell>{member.departmentName ?? "—"}</TableCell>
            <TableCell>
              <StatusBadge label={member.active ? "Active" : "Inactive"} variant={member.active ? "success" : "destructive"} />
            </TableCell>
            <TableCell className="text-right space-x-1">
              <Button variant="ghost" size="icon" onClick={() => router.push(`/staff/employees/${member.id}`)}>
                <Pencil className="h-4 w-4" />
              </Button>
              {member.active && (
                <Button variant="ghost" size="icon" onClick={() => onDeactivate(member.id)}>
                  <UserX className="h-4 w-4" />
                </Button>
              )}
              <Button variant="ghost" size="icon" onClick={() => onDelete(member.id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}