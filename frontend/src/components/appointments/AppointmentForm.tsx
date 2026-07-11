"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { appointmentSchema, AppointmentFormValues } from "@/schemas/appointment.schema";
import { Appointment, AppointmentStatus } from "@/types/appointment.types";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCreateAppointment, useUpdateAppointment } from "@/hooks/useAppointments";
import { patientApi } from "@/lib/api/patient.api";
import { doctorApi } from "@/lib/api/staff.api";
import { useDebounce } from "@/hooks/useDebounce";
import { ROUTES } from "@/lib/constants/routes";

interface AppointmentFormProps {
    appointment?: Appointment;
}

export function AppointmentForm({ appointment }: AppointmentFormProps) {
    const router = useRouter();
    const createMutation = useCreateAppointment();
    const updateMutation = useUpdateAppointment();
    const isEdit = !!appointment;

    const [patientQuery, setPatientQuery] = useState("");
    const debouncedPatientQuery = useDebounce(patientQuery, 400);

    const {
        data: patientResults,
        isLoading: isLoadingPatients,
        isError: isPatientLookupError,
    } = useQuery({
        queryKey: ["patient-search-lookup", debouncedPatientQuery],
        queryFn: () =>
            debouncedPatientQuery.length > 1
                ? patientApi.search({ firstName: debouncedPatientQuery, size: 10 })
                : patientApi.getAll({ page: 0, size: 10, sortBy: "firstName", sortDirection: "ASC" }),
    });

    const {
        data: doctors,
        isLoading: isLoadingDoctors,
        isError: isDoctorLookupError,
    } = useQuery({
        queryKey: ["doctors-lookup"],
        queryFn: () => doctorApi.getAll({ page: 0, size: 100, sortBy: "firstName", sortDirection: "ASC" }),
    });

    const form = useForm<AppointmentFormValues>({
        resolver: zodResolver(appointmentSchema),
        defaultValues: {
            patientId: appointment?.patientId ?? "",
            doctorId: appointment?.doctorId ?? "",
            appointmentDate: appointment?.appointmentDate?.slice(0, 16) ?? "",
            reason: appointment?.reason ?? "",
            notes: appointment?.notes ?? "",
            status: appointment?.status ?? AppointmentStatus.SCHEDULED,
        },
    });

    async function onSubmit(values: AppointmentFormValues) {
        if (isEdit && appointment) {
            await updateMutation.mutateAsync({ id: appointment.id, data: values });
        } else {
            await createMutation.mutateAsync(values);
        }
        router.push(ROUTES.APPOINTMENTS);
    }

    const isSubmitting = createMutation.isPending || updateMutation.isPending;
    const patientOptions = patientResults?.content ?? [];
    const doctorOptions = doctors?.content ?? [];

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Card className="overflow-hidden">
                    <CardHeader className="border-b bg-muted/40">
                        <CardTitle>Appointment Details</CardTitle>
                        <CardDescription>Schedule care with a patient, clinician, and confirmed time.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <FormField
                            control={form.control}
                            name="patientId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Patient</FormLabel>
                                    {isEdit && appointment ? (
                                        <Input value={appointment.patientName} disabled />
                                    ) : (
                                        <>
                                            <Input
                                                placeholder="Type to search patient by first name..."
                                                value={patientQuery}
                                                onChange={(e) => setPatientQuery(e.target.value)}
                                            />
                                            <Select onValueChange={field.onChange} value={field.value ?? ""} disabled={isLoadingPatients || isPatientLookupError}>
                                                <FormControl>
                                                    <SelectTrigger><SelectValue placeholder="Select patient" /></SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {isLoadingPatients && <SelectItem value="loading-patients" disabled>Loading patients...</SelectItem>}
                                                    {isPatientLookupError && <SelectItem value="patient-error" disabled>Unable to load patients. Check login permissions.</SelectItem>}
                                                    {!isLoadingPatients && !isPatientLookupError && patientOptions.length === 0 && (
                                                        <SelectItem value="no-patients" disabled>No patients found</SelectItem>
                                                    )}
                                                    {patientOptions.map((p) => (
                                                        <SelectItem key={p.id} value={p.id}>
                                                            {p.firstName} {p.lastName} ({p.patientNumber})
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </>
                                    )}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="doctorId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Doctor</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value ?? ""} disabled={isLoadingDoctors || isDoctorLookupError}>
                                        <FormControl>
                                            <SelectTrigger><SelectValue placeholder="Select doctor" /></SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {isLoadingDoctors && <SelectItem value="loading-doctors" disabled>Loading doctors...</SelectItem>}
                                            {isDoctorLookupError && <SelectItem value="doctor-error" disabled>Unable to load doctors. Check login permissions.</SelectItem>}
                                            {!isLoadingDoctors && !isDoctorLookupError && doctorOptions.length === 0 && (
                                                <SelectItem value="no-doctors" disabled>No doctors found</SelectItem>
                                            )}
                                            {doctorOptions.map((d) => (
                                                <SelectItem key={d.id} value={d.id}>
                                                    Dr. {d.firstName} {d.lastName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="appointmentDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Date & Time</FormLabel>
                                    <FormControl><Input type="datetime-local" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {isEdit && (
                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Status</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value ?? AppointmentStatus.SCHEDULED}>
                                            <FormControl>
                                                <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {Object.values(AppointmentStatus).map((s) => (
                                                    <SelectItem key={s} value={s}>{s}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        <FormField
                            control={form.control}
                            name="reason"
                            render={({ field }) => (
                                <FormItem className="sm:col-span-2">
                                    <FormLabel>Reason</FormLabel>
                                    <FormControl><Input {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="notes"
                            render={({ field }) => (
                                <FormItem className="sm:col-span-2">
                                    <FormLabel>Notes</FormLabel>
                                    <FormControl><Input {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-3">
                    <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Saving..." : isEdit ? "Update Appointment" : "Create Appointment"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
