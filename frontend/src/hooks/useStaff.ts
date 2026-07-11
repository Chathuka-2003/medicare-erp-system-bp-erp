"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { doctorApi, staffApi } from "@/lib/api/staff.api";
import { DoctorRequest, StaffRequest } from "@/types/staff.types";

const DOCTORS_KEY = "doctors";
const STAFF_KEY = "staff";

export function useDoctors(params: { page?: number; size?: number; sortBy?: string; sortDirection?: "ASC" | "DESC" }) {
  return useQuery({
    queryKey: [DOCTORS_KEY, "all", params],
    queryFn: () => doctorApi.getAll(params),
  });
}

export function useDoctor(id: string | undefined) {
  return useQuery({
    queryKey: [DOCTORS_KEY, id],
    queryFn: () => doctorApi.getById(id as string),
    enabled: !!id,
  });
}

export function useCreateDoctor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: DoctorRequest) => doctorApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DOCTORS_KEY] });
      toast.success("Doctor created successfully");
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? "Failed to create doctor"),
  });
}

export function useUpdateDoctor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: DoctorRequest }) => doctorApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DOCTORS_KEY] });
      toast.success("Doctor updated successfully");
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? "Failed to update doctor"),
  });
}

export function useDeleteDoctor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => doctorApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DOCTORS_KEY] });
      toast.success("Doctor deleted successfully");
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? "Failed to delete doctor"),
  });
}

export function useStaffList(params: { page?: number; size?: number; sortBy?: string; sortDirection?: "ASC" | "DESC" }) {
  return useQuery({
    queryKey: [STAFF_KEY, "all", params],
    queryFn: () => staffApi.getAll(params),
  });
}

export function useStaffMember(id: string | undefined) {
  return useQuery({
    queryKey: [STAFF_KEY, id],
    queryFn: () => staffApi.getById(id as string),
    enabled: !!id,
  });
}

export function useCreateStaff() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: StaffRequest) => staffApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [STAFF_KEY] });
      toast.success("Staff member created successfully");
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? "Failed to create staff member"),
  });
}

export function useUpdateStaff() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: StaffRequest }) => staffApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [STAFF_KEY] });
      toast.success("Staff member updated successfully");
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? "Failed to update staff member"),
  });
}

export function useDeactivateStaff() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => staffApi.deactivate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [STAFF_KEY] });
      toast.success("Staff member deactivated");
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? "Failed to deactivate staff member"),
  });
}

export function useDeleteStaff() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => staffApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [STAFF_KEY] });
      toast.success("Staff member deleted successfully");
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? "Failed to delete staff member"),
  });
}