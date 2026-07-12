"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { medicalRecordApi, prescriptionApi, allergyApi } from "@/lib/api/emr.api";
import { AllergyRequest, MedicalRecordRequest, PrescriptionRequest } from "@/types/emr.types";


const RECORDS_KEY = "medical-records";
const PRESCRIPTIONS_KEY = "prescriptions";

export function useMedicalRecordsByPatient(patientId: string | undefined) {
  return useQuery({
    queryKey: [RECORDS_KEY, "patient", patientId],
    queryFn: () => medicalRecordApi.getByPatient(patientId as string),
    enabled: !!patientId,
  });
}

export function useMedicalRecord(id: string | undefined) {
  return useQuery({
    queryKey: [RECORDS_KEY, id],
    queryFn: () => medicalRecordApi.getById(id as string),
    enabled: !!id,
  });
}

export function useCreateMedicalRecord() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: MedicalRecordRequest) => medicalRecordApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [RECORDS_KEY] });
      toast.success("Medical record created successfully");
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? "Failed to create medical record"),
  });
}

export function useUpdateMedicalRecord() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: MedicalRecordRequest }) => medicalRecordApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [RECORDS_KEY] });
      toast.success("Medical record updated successfully");
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? "Failed to update medical record"),
  });
}

export function useDeleteMedicalRecord() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => medicalRecordApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [RECORDS_KEY] });
      toast.success("Medical record deleted successfully");
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? "Failed to delete medical record"),
  });
}

export function usePrescriptionByRecord(medicalRecordId: string | undefined) {
  return useQuery({
    queryKey: [PRESCRIPTIONS_KEY, "record", medicalRecordId],
    queryFn: () => prescriptionApi.getByMedicalRecord(medicalRecordId as string),
    enabled: !!medicalRecordId,
    retry: false, // 404 is expected when no prescription exists yet
  });
}

export function useCreatePrescription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ medicalRecordId, data }: { medicalRecordId: string; data: PrescriptionRequest }) =>
      prescriptionApi.create(medicalRecordId, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: [PRESCRIPTIONS_KEY, "record", variables.medicalRecordId] });
      queryClient.invalidateQueries({ queryKey: [RECORDS_KEY] });
      toast.success("Prescription created successfully");
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? "Failed to create prescription"),
  });
}

export function useUpdatePrescription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: PrescriptionRequest }) => prescriptionApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRESCRIPTIONS_KEY] });
      queryClient.invalidateQueries({ queryKey: [RECORDS_KEY] });
      toast.success("Prescription updated successfully");
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? "Failed to update prescription"),
  });
}

const ALLERGIES_KEY = "allergies";

export function useAllergiesByPatient(patientId: string | undefined) {
  return useQuery({
    queryKey: [ALLERGIES_KEY, "patient", patientId],
    queryFn: () => allergyApi.getByPatient(patientId as string),
    enabled: !!patientId,
  });
}

export function useAddAllergy(patientId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AllergyRequest) => allergyApi.add(patientId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ALLERGIES_KEY, "patient", patientId] });
      toast.success("Allergy added successfully");
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? "Failed to add allergy"),
  });
}

export function useDeleteAllergy(patientId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (allergyId: string) => allergyApi.delete(allergyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ALLERGIES_KEY, "patient", patientId] });
      toast.success("Allergy removed");
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? "Failed to delete allergy"),
  });
}
