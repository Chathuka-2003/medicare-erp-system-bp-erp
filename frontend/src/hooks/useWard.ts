"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { wardApi, bedApi, admissionApi } from "@/lib/api/ward.api";
import { WardRequest, BedRequest, AdmissionRequest, BedStatus } from "@/types/ward.types";

const WARDS_KEY = "wards";
const BEDS_KEY = "beds";
const ADMISSIONS_KEY = "admissions";

export function useWards() {
  return useQuery({ queryKey: [WARDS_KEY, "all"], queryFn: () => wardApi.getAll() });
}

export function useWard(id: string | undefined) {
  return useQuery({
    queryKey: [WARDS_KEY, id],
    queryFn: () => wardApi.getById(id as string),
    enabled: !!id,
  });
}

export function useCreateWard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: WardRequest) => wardApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [WARDS_KEY] });
      toast.success("Ward created successfully");
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? "Failed to create ward"),
  });
}

export function useUpdateWard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: WardRequest }) => wardApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [WARDS_KEY] });
      toast.success("Ward updated successfully");
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? "Failed to update ward"),
  });
}

export function useDeleteWard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => wardApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [WARDS_KEY] });
      toast.success("Ward deleted successfully");
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? "Failed to delete ward"),
  });
}

export function useBedsByWard(wardId: string | undefined) {
  return useQuery({
    queryKey: [BEDS_KEY, "ward", wardId],
    queryFn: () => bedApi.getByWard(wardId as string),
    enabled: !!wardId,
  });
}

export function useAvailableBedsByWard(wardId: string | undefined) {
  return useQuery({
    queryKey: [BEDS_KEY, "ward", wardId, "available"],
    queryFn: () => bedApi.getAvailableByWard(wardId as string),
    enabled: !!wardId,
  });
}

export function useCreateBed() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: BedRequest) => bedApi.create(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: [BEDS_KEY, "ward", variables.wardId] });
      queryClient.invalidateQueries({ queryKey: [WARDS_KEY] });
      toast.success("Bed created successfully");
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? "Failed to create bed"),
  });
}

export function useUpdateBedStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: BedStatus }) => bedApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BEDS_KEY] });
      queryClient.invalidateQueries({ queryKey: [WARDS_KEY] });
      toast.success("Bed status updated");
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? "Failed to update bed status"),
  });
}

export function useDeleteBed() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => bedApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BEDS_KEY] });
      queryClient.invalidateQueries({ queryKey: [WARDS_KEY] });
      toast.success("Bed deleted successfully");
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? "Failed to delete bed"),
  });
}

export function useCurrentAdmissions() {
  return useQuery({ queryKey: [ADMISSIONS_KEY, "current"], queryFn: () => admissionApi.getCurrent() });
}

export function useAdmissionsByPatient(patientId: string | undefined) {
  return useQuery({
    queryKey: [ADMISSIONS_KEY, "patient", patientId],
    queryFn: () => admissionApi.getByPatient(patientId as string),
    enabled: !!patientId,
  });
}

export function useAdmission(id: string | undefined) {
  return useQuery({
    queryKey: [ADMISSIONS_KEY, id],
    queryFn: () => admissionApi.getById(id as string),
    enabled: !!id,
  });
}

export function useAdmitPatient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AdmissionRequest) => admissionApi.admit(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMISSIONS_KEY] });
      queryClient.invalidateQueries({ queryKey: [BEDS_KEY] });
      queryClient.invalidateQueries({ queryKey: [WARDS_KEY] });
      toast.success("Patient admitted successfully");
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? "Failed to admit patient"),
  });
}

export function useDischargePatient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => admissionApi.discharge(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMISSIONS_KEY] });
      queryClient.invalidateQueries({ queryKey: [BEDS_KEY] });
      queryClient.invalidateQueries({ queryKey: [WARDS_KEY] });
      toast.success("Patient discharged successfully");
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? "Failed to discharge patient"),
  });
}
