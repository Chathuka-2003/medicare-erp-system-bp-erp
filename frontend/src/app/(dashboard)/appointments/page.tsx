"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { Pagination } from "@/components/common/Pagination";
import { AppointmentTable } from "@/components/appointments/AppointmentTable";
import { useAppointments, useAppointmentsByDoctor, useCancelAppointment } from "@/hooks/useAppointments";
import { usePagination } from "@/hooks/usePagination";
import { doctorApi } from "@/lib/api/staff.api";
import { ROUTES } from "@/lib/constants/routes";
import { AlertTriangle, Plus } from "lucide-react";

export default function AppointmentsPage() {
    const router = useRouter();
    const [doctorId, setDoctorId] = useState<string>("ALL");
    const { page, size, setPage } = usePagination(0, 10);

    const { data: doctors, isLoading: isLoadingDoctors, isError: isDoctorsError } = useQuery({
        queryKey: ["doctors-lookup"],
        queryFn: () => doctorApi.getAll({ page: 0, size: 100 }),
    });

    const allAppointments = useAppointments({
        page,
        size,
        sortBy: "appointmentDate",
        sortDirection: "DESC",
    });

    const doctorAppointments = useAppointmentsByDoctor(doctorId !== "ALL" ? doctorId : undefined);
    const cancelMutation = useCancelAppointment();

    const isFilteredByDoctor = doctorId !== "ALL";
    const isLoading = isFilteredByDoctor ? doctorAppointments.isLoading : allAppointments.isLoading;
    const isError = isFilteredByDoctor ? doctorAppointments.isError : allAppointments.isError;
    const appointments = isFilteredByDoctor ? doctorAppointments.data ?? [] : allAppointments.data?.content ?? [];

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Appointments</h1>
                <Button onClick={() => router.push(ROUTES.APPOINTMENTS + "/new")}>
                    <Plus className="mr-2 h-4 w-4" />
                    New Appointment
                </Button>
            </div>

            <Card>
                <CardContent className="pt-6">
                    <Select value={doctorId} onValueChange={setDoctorId}>
                        <SelectTrigger className="w-full sm:w-80">
                            <SelectValue placeholder="Filter by doctor" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All doctors</SelectItem>
                            {isLoadingDoctors && <SelectItem value="loading-doctors" disabled>Loading doctors...</SelectItem>}
                            {isDoctorsError && <SelectItem value="doctor-error" disabled>Unable to load doctors</SelectItem>}
                            {doctors?.content.map((d) => (
                                <SelectItem key={d.id} value={d.id}>
                                    Dr. {d.firstName} {d.lastName}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="pt-6">
                    {isLoading ? (
                        <LoadingSpinner />
                    ) : isError ? (
                        <div className="flex items-start gap-3 rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
                            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                            <div>
                                <p className="font-semibold">Appointments could not be loaded.</p>
                                <p className="mt-1 text-destructive/80">Please sign in with an authorized staff account and confirm the backend API is running.</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <AppointmentTable appointments={appointments} onCancel={(id) => cancelMutation.mutate(id)} />
                            {!isFilteredByDoctor && allAppointments.data && (
                                <Pagination
                                    page={allAppointments.data.pageNumber}
                                    totalPages={allAppointments.data.totalPages}
                                    onPageChange={setPage}
                                />
                            )}
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
