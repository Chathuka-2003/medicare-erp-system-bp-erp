"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { labTestApi, labResultApi } from "@/lib/api/laboratory.api";
import { LabTestRequest, LabOrderRequest, LabResultRequest } from "@/types/laboratory.types";

const LAB_TESTS_KEY = "lab-tests";
const LAB_ORDERS_KEY = "lab-orders";
const LAB_RESULTS_KEY = "lab-results";

export function useLabTests(params: { page?: number; size?: number; sortBy?: string; sortDirection?: "ASC" | "DESC" }) {
  return useQuery({
    queryKey: [LAB_TESTS_KEY, "all", params],
    queryFn: () => labTestApi.getAll(params),
  });
}

export function useLabTest(id: string | undefined) {
  return useQuery({
    queryKey: [LAB_TESTS_KEY, id],
    queryFn: () => labTestApi.getById(id as string),
    enabled: !!id,
  });
}

export function useCreateLabTest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: LabTestRequest) => labTestApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LAB_TESTS_KEY] });
      toast.success("Lab test created successfully");
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? "Failed to create lab test"),
  });
}

export function useUpdateLabTest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: LabTestRequest }) => labTestApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LAB_TESTS_KEY] });
      toast.success("Lab test updated successfully");
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? "Failed to update lab test"),
  });
}

export function useDeleteLabTest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => labTestApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LAB_TESTS_KEY] });
      toast.success("Lab test deleted successfully");
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? "Failed to delete lab test"),
  });
}

export function useLabOrdersByPatient(patientId: string | undefined) {
  return useQuery({
    queryKey: [LAB_ORDERS_KEY, "patient", patientId],
    queryFn: () => labResultApi.getOrdersByPatient(patientId as string),
    enabled: !!patientId,
  });
}

export function useLabOrder(id: string | undefined) {
  return useQuery({
    queryKey: [LAB_ORDERS_KEY, id],
    queryFn: () => labResultApi.getOrderById(id as string),
    enabled: !!id,
  });
}

export function useCreateLabOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: LabOrderRequest) => labResultApi.createOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LAB_ORDERS_KEY] });
      toast.success("Lab order created successfully");
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? "Failed to create lab order"),
  });
}

export function useResultByOrderItem(labOrderItemId: string | undefined) {
  return useQuery({
    queryKey: [LAB_RESULTS_KEY, "order-item", labOrderItemId],
    queryFn: () => labResultApi.getResultByOrderItem(labOrderItemId as string),
    enabled: !!labOrderItemId,
    retry: false, // 404 expected when no result exists yet
  });
}

export function useRecordLabResult() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: LabResultRequest) => labResultApi.recordResult(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: [LAB_RESULTS_KEY, "order-item", variables.labOrderItemId] });
      queryClient.invalidateQueries({ queryKey: [LAB_ORDERS_KEY] });
      toast.success("Lab result recorded successfully");
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? "Failed to record lab result"),
  });
}
