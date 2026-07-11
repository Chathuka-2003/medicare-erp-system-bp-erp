"use client";

import { useRouter } from "next/navigation";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common/EmptyState";
import { Patient } from "@/types/patient.types";
import { ROUTES } from "@/lib/constants/routes";
import { Pencil, Trash2, Eye } from "lucide-react";

interface PatientTableProps {
  patients: Patient[];
  onDelete: (id: string) => void;
}

export function PatientTable({ patients, onDelete }: PatientTableProps) {
  const router = useRouter();

  if (patients.length === 0) {
    return <EmptyState title="No patients found" description="Try adjusting your search filters." />;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Patient No.</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Gender</TableHead>
          <TableHead>Age</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {patients.map((patient) => (
          <TableRow key={patient.id}>
            <TableCell className="font-medium">{patient.patientNumber}</TableCell>
            <TableCell>{patient.firstName} {patient.lastName ?? ""}</TableCell>
            <TableCell>{patient.phone ?? "—"}</TableCell>
            <TableCell>{patient.gender ?? "—"}</TableCell>
            <TableCell>{patient.age ?? "—"}</TableCell>
            <TableCell className="text-right space-x-1">
              <Button variant="ghost" size="icon" onClick={() => router.push(ROUTES.PATIENT_DETAIL(patient.id))}>
                <Eye className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => router.push(ROUTES.PATIENT_EDIT(patient.id))}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => onDelete(patient.id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}