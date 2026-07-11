"use client";

import { useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common/EmptyState";
import { Doctor } from "@/types/staff.types";
import { Pencil, Trash2 } from "lucide-react";

interface DoctorTableProps {
  doctors: Doctor[];
  onDelete: (id: string) => void;
}

export function DoctorTable({ doctors, onDelete }: DoctorTableProps) {
  const router = useRouter();

  if (doctors.length === 0) {
    return <EmptyState title="No doctors found" />;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>License No.</TableHead>
          <TableHead>Department</TableHead>
          <TableHead>Specialization</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {doctors.map((doctor) => (
          <TableRow key={doctor.id}>
            <TableCell className="font-medium">Dr. {doctor.firstName} {doctor.lastName ?? ""}</TableCell>
            <TableCell>{doctor.licenseNumber}</TableCell>
            <TableCell>{doctor.departmentName ?? "—"}</TableCell>
            <TableCell>{doctor.specializationName ?? "—"}</TableCell>
            <TableCell>{doctor.phone ?? "—"}</TableCell>
            <TableCell className="text-right space-x-1">
              <Button variant="ghost" size="icon" onClick={() => router.push(`/staff/doctors/${doctor.id}`)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => onDelete(doctor.id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}