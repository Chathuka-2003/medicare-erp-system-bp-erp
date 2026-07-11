"use client";

import { useParams, useRouter } from "next/navigation";
import { useAppointment, useCancelAppointment } from "@/hooks/useAppointments";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/StatusBadge";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { formatDateTime } from "@/lib/utils/format";
import { getAppointmentStatusVariant } from "@/lib/utils/appointment-status";
import { ROUTES } from "@/lib/constants/routes";

export default function AppointmentDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { data: appointment, isLoading } = useAppointment(params.id as string);
    const cancelMutation = useCancelAppointment();

    if (isLoading) return <LoadingSpinner />;
    if (!appointment) return <p className="p-6">Appointment not found.</p>;

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Appointment Details</h1>
                {appointment.status !== "CANCELLED" && appointment.status !== "COMPLETED" && (
                    <Button variant="destructive" onClick={() => cancelMutation.mutate(appointment.id)}>
                        Cancel Appointment
                    </Button>
                )}
            </div>

            <Card>
                <CardHeader><CardTitle>Details</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <p><span className="text-muted-foreground">Patient:</span> {appointment.patientName}</p>
                    <p><span className="text-muted-foreground">Doctor:</span> {appointment.doctorName}</p>
                    <p><span className="text-muted-foreground">Date & Time:</span> {formatDateTime(appointment.appointmentDate)}</p>
                    <p>
                        <span className="text-muted-foreground">Status:</span>{" "}
                        <StatusBadge label={appointment.status} variant={getAppointmentStatusVariant(appointment.status)} />
                    </p>
                    <p><span className="text-muted-foreground">Reason:</span> {appointment.reason ?? "—"}</p>
                    <p><span className="text-muted-foreground">Notes:</span> {appointment.notes ?? "—"}</p>
                </CardContent>
            </Card>
        </div>
    );
}