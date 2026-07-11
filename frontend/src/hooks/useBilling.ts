"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { invoiceApi, paymentApi, insuranceClaimApi } from "@/lib/api/billing.api";
import { InvoiceRequest, PaymentRequest, InsuranceClaimRequest } from "@/types/billing.types";

const INVOICES_KEY = "invoices";
const PAYMENTS_KEY = "payments";
const CLAIMS_KEY = "insurance-claims";

// Invoices
export function useInvoices(params: { page?: number; size?: number; sortBy?: string; sortDirection?: "ASC" | "DESC" }) {
  return useQuery({
    queryKey: [INVOICES_KEY, "all", params],
    queryFn: () => invoiceApi.getAll(params),
  });
}

export function useInvoice(id: string | undefined) {
  return useQuery({
    queryKey: [INVOICES_KEY, id],
    queryFn: () => invoiceApi.getById(id as string),
    enabled: !!id,
  });
}

export function useInvoicesByPatient(patientId: string | undefined) {
  return useQuery({
    queryKey: [INVOICES_KEY, "patient", patientId],
    queryFn: () => invoiceApi.getByPatient(patientId as string),
    enabled: !!patientId,
  });
}

export function useCreateInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: InvoiceRequest) => invoiceApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [INVOICES_KEY] });
      toast.success("Invoice created successfully");
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? "Failed to create invoice"),
  });
}

export function useUpdateInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: InvoiceRequest }) => invoiceApi.update(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: [INVOICES_KEY] });
      queryClient.invalidateQueries({ queryKey: [INVOICES_KEY, variables.id] });
      toast.success("Invoice updated successfully");
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? "Failed to update invoice"),
  });
}

export function useCancelInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => invoiceApi.cancel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [INVOICES_KEY] });
      toast.success("Invoice cancelled");
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? "Failed to cancel invoice"),
  });
}

export function useDeleteInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => invoiceApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [INVOICES_KEY] });
      toast.success("Invoice deleted");
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? "Failed to delete invoice"),
  });
}

// Payments
export function usePaymentsByInvoice(invoiceId: string | undefined) {
  return useQuery({
    queryKey: [PAYMENTS_KEY, "invoice", invoiceId],
    queryFn: () => paymentApi.getByInvoice(invoiceId as string),
    enabled: !!invoiceId,
  });
}

export function useRecordPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PaymentRequest) => paymentApi.record(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: [PAYMENTS_KEY, "invoice", variables.invoiceId] });
      queryClient.invalidateQueries({ queryKey: [INVOICES_KEY, variables.invoiceId] });
      queryClient.invalidateQueries({ queryKey: [INVOICES_KEY] });
      toast.success("Payment recorded successfully");
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? "Failed to record payment"),
  });
}

export function useDeletePayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => paymentApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PAYMENTS_KEY] });
      queryClient.invalidateQueries({ queryKey: [INVOICES_KEY] });
      toast.success("Payment deleted");
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? "Failed to delete payment"),
  });
}

// Insurance Claims
export function useInsuranceClaimsByPatient(patientId: string | undefined) {
  return useQuery({
    queryKey: [CLAIMS_KEY, "patient", patientId],
    queryFn: () => insuranceClaimApi.getByPatient(patientId as string),
    enabled: !!patientId,
  });
}

export function useInsuranceClaim(id: string | undefined) {
  return useQuery({
    queryKey: [CLAIMS_KEY, id],
    queryFn: () => insuranceClaimApi.getById(id as string),
    enabled: !!id,
  });
}

export function useCreateInsuranceClaim() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: InsuranceClaimRequest) => insuranceClaimApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CLAIMS_KEY] });
      toast.success("Insurance claim created successfully");
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? "Failed to create insurance claim"),
  });
}

export function useUpdateInsuranceClaim() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: InsuranceClaimRequest }) => insuranceClaimApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CLAIMS_KEY] });
      toast.success("Insurance claim updated successfully");
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? "Failed to update insurance claim"),
  });
}

export function useDeleteInsuranceClaim() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => insuranceClaimApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CLAIMS_KEY] });
      toast.success("Insurance claim deleted");
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? "Failed to delete insurance claim"),
  });
}