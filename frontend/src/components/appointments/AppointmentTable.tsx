"use client";

import { useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/StatusBadge";
import { EmptyState } from "@/components/common/EmptyState";
import { Appointment } from "@/types/appointment.types";
import { formatDateTime } from "@/lib/utils/format";
import { getAppointmentStatusVariant } from "@/lib/utils/appointment-status";
import { Eye, XCircle } from "lucide-react";

interface AppointmentTableProps {
    appointments: Appointment[];
    onCancel: (id: string) => void;
}

export function AppointmentTable({ appointments, onCancel }: AppointmentTableProps) {
    const router = useRouter();

    if (appointments.length === 0) {
        return <EmptyState title="No appointments found" />;
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {appointments.map((appt) => (
                    <TableRow key={appt.id}>
                        <TableCell>{formatDateTime(appt.appointmentDate)}</TableCell>
                        <TableCell>{appt.patientName}</TableCell>
                        <TableCell>{appt.doctorName}</TableCell>
                        <TableCell>{appt.reason ?? "-"}</TableCell>
                        <TableCell>
                            <StatusBadge label={appt.status} variant={getAppointmentStatusVariant(appt.status)} />
                        </TableCell>
                        <TableCell className="text-right space-x-1">
                            <Button variant="ghost" size="icon" onClick={() => router.push(`/appointments/${appt.id}`)}>
                                <Eye className="h-4 w-4" />
                            </Button>
                            {appt.status !== "CANCELLED" && appt.status !== "COMPLETED" && (
                                <Button variant="ghost" size="icon" onClick={() => onCancel(appt.id)}>
                                    <XCircle className="h-4 w-4 text-destructive" />
                                </Button>
                            )}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
