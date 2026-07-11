"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { appointmentApi } from "@/lib/api/appointment.api";
import { AppointmentRequest, AppointmentStatus } from "@/types/appointment.types";

const APPOINTMENTS_KEY = "appointments";

export function useAppointments(params: {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDirection?: "ASC" | "DESC";
}) {
    return useQuery({
        queryKey: [APPOINTMENTS_KEY, "all", params],
        queryFn: () => appointmentApi.getAll(params),
    });
}

export function useAppointmentsByPatient(patientId: string | undefined) {
    return useQuery({
        queryKey: [APPOINTMENTS_KEY, "patient", patientId],
        queryFn: () => appointmentApi.getByPatient(patientId as string),
        enabled: !!patientId,
    });
}

export function useAppointmentsByDoctor(doctorId: string | undefined) {
    return useQuery({
        queryKey: [APPOINTMENTS_KEY, "doctor", doctorId],
        queryFn: () => appointmentApi.getByDoctor(doctorId as string),
        enabled: !!doctorId,
    });
}

export function useAppointment(id: string | undefined) {
    return useQuery({
        queryKey: [APPOINTMENTS_KEY, id],
        queryFn: () => appointmentApi.getById(id as string),
        enabled: !!id,
    });
}

export function useCreateAppointment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: AppointmentRequest) => appointmentApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [APPOINTMENTS_KEY] });
            toast.success("Appointment created successfully");
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message ?? "Failed to create appointment");
        },
    });
}

export function useUpdateAppointment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: AppointmentRequest }) => appointmentApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [APPOINTMENTS_KEY] });
            toast.success("Appointment updated successfully");
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message ?? "Failed to update appointment");
        },
    });
}

export function useUpdateAppointmentStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, status }: { id: string; status: AppointmentStatus }) =>
            appointmentApi.updateStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [APPOINTMENTS_KEY] });
            toast.success("Appointment status updated");
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message ?? "Failed to update status");
        },
    });
}

export function useCancelAppointment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => appointmentApi.cancel(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [APPOINTMENTS_KEY] });
            toast.success("Appointment cancelled");
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message ?? "Failed to cancel appointment");
        },
    });
}

export function useDeleteAppointment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => appointmentApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [APPOINTMENTS_KEY] });
            toast.success("Appointment deleted");
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message ?? "Failed to delete appointment");
        },
    });
}