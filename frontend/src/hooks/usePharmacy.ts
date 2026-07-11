"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { medicineApi, drugDispenseApi } from "@/lib/api/pharmacy.api";
import { MedicineRequest, MedicineStockRequest, DrugDispenseRequest } from "@/types/pharmacy.types";

const MEDICINES_KEY = "medicines";
const DISPENSES_KEY = "drug-dispenses";

export function useMedicines(params: { page?: number; size?: number; sortBy?: string; sortDirection?: "ASC" | "DESC" }) {
    return useQuery({
        queryKey: [MEDICINES_KEY, "all", params],
        queryFn: () => medicineApi.getAll(params),
    });
}

export function useMedicine(id: string | undefined) {
    return useQuery({
        queryKey: [MEDICINES_KEY, id],
        queryFn: () => medicineApi.getById(id as string),
        enabled: !!id,
    });
}

export function useMedicineStock(medicineId: string | undefined) {
    return useQuery({
        queryKey: [MEDICINES_KEY, medicineId, "stock"],
        queryFn: () => medicineApi.getStock(medicineId as string),
        enabled: !!medicineId,
    });
}

export function useCreateMedicine() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: MedicineRequest) => medicineApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [MEDICINES_KEY] });
            toast.success("Medicine created successfully");
        },
        onError: (error: any) => toast.error(error?.response?.data?.message ?? "Failed to create medicine"),
    });
}

export function useUpdateMedicine() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: MedicineRequest }) => medicineApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [MEDICINES_KEY] });
            toast.success("Medicine updated successfully");
        },
        onError: (error: any) => toast.error(error?.response?.data?.message ?? "Failed to update medicine"),
    });
}

export function useDeleteMedicine() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => medicineApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [MEDICINES_KEY] });
            toast.success("Medicine deleted successfully");
        },
        onError: (error: any) => toast.error(error?.response?.data?.message ?? "Failed to delete medicine"),
    });
}

export function useAddMedicineStock() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ medicineId, data }: { medicineId: string; data: MedicineStockRequest }) =>
            medicineApi.addStock(medicineId, data),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: [MEDICINES_KEY, variables.medicineId, "stock"] });
            queryClient.invalidateQueries({ queryKey: [MEDICINES_KEY] });
            toast.success("Stock added successfully");
        },
        onError: (error: any) => toast.error(error?.response?.data?.message ?? "Failed to add stock"),
    });
}

export function useDrugDispensesByPatient(patientId: string | undefined) {
    return useQuery({
        queryKey: [DISPENSES_KEY, "patient", patientId],
        queryFn: () => drugDispenseApi.getByPatient(patientId as string),
        enabled: !!patientId,
    });
}

export function useDrugDispense(id: string | undefined) {
    return useQuery({
        queryKey: [DISPENSES_KEY, id],
        queryFn: () => drugDispenseApi.getById(id as string),
        enabled: !!id,
    });
}

export function useCreateDrugDispense() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: DrugDispenseRequest) => drugDispenseApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [DISPENSES_KEY] });
            queryClient.invalidateQueries({ queryKey: [MEDICINES_KEY] });
            toast.success("Drugs dispensed successfully");
        },
        onError: (error: any) => toast.error(error?.response?.data?.message ?? "Failed to dispense drugs"),
    });
}