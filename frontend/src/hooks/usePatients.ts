"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { patientApi } from "@/lib/api/patient.api";
import { PatientRequest, PatientSearchParams } from "@/types/patient.types";

const PATIENTS_KEY = "patients";

export function usePatients(params: PatientSearchParams) {
  return useQuery({
    queryKey: [PATIENTS_KEY, "search", params],
    queryFn: () => patientApi.search(params),
  });
}

export function usePatient(id: string | undefined) {
  return useQuery({
    queryKey: [PATIENTS_KEY, id],
    queryFn: () => patientApi.getById(id as string),
    enabled: !!id,
  });
}

export function useCreatePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PatientRequest) => patientApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PATIENTS_KEY] });
      toast.success("Patient created successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? "Failed to create patient");
    },
  });
}

export function useUpdatePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: PatientRequest }) => patientApi.update(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: [PATIENTS_KEY] });
      queryClient.invalidateQueries({ queryKey: [PATIENTS_KEY, variables.id] });
      toast.success("Patient updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? "Failed to update patient");
    },
  });
}

export function useDeletePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => patientApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PATIENTS_KEY] });
      toast.success("Patient deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? "Failed to delete patient");
    },
  });
}