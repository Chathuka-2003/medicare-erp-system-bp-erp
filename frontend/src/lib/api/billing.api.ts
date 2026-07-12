import { apiClient } from "./client";
import { ApiResponse, PageResponse } from "@/types/common.types";
import {
  Invoice, InvoiceRequest, Payment, PaymentRequest,
  InsuranceClaim, InsuranceClaimRequest,
} from "@/types/billing.types";

const INVOICE_BASE_PATH = "/invoices";
const PAYMENT_BASE_PATH = "/payments";
const CLAIM_BASE_PATH = "/insurance-claims";

export const invoiceApi = {
  create: async (data: InvoiceRequest): Promise<Invoice> => {
    const response = await apiClient.post<ApiResponse<Invoice>>(INVOICE_BASE_PATH, data);
    return response.data.data;
  },

  getById: async (id: string): Promise<Invoice> => {
    const response = await apiClient.get<ApiResponse<Invoice>>(`${INVOICE_BASE_PATH}/${id}`);
    return response.data.data;
  },

  getAll: async (params: {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDirection?: "ASC" | "DESC";
  }): Promise<PageResponse<Invoice>> => {
    const response = await apiClient.get<ApiResponse<PageResponse<Invoice>>>(INVOICE_BASE_PATH, { params });
    return response.data.data;
  },

  getByPatient: async (patientId: string): Promise<Invoice[]> => {
    const response = await apiClient.get<ApiResponse<Invoice[]>>(`${INVOICE_BASE_PATH}/patient/${patientId}`);
    return response.data.data;
  },

  update: async (id: string, data: InvoiceRequest): Promise<Invoice> => {
    const response = await apiClient.put<ApiResponse<Invoice>>(`${INVOICE_BASE_PATH}/${id}`, data);
    return response.data.data;
  },

  cancel: async (id: string): Promise<void> => {
    await apiClient.patch(`${INVOICE_BASE_PATH}/${id}/cancel`);
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`${INVOICE_BASE_PATH}/${id}`);
  },
};

export const paymentApi = {
  record: async (data: PaymentRequest): Promise<Payment> => {
    const response = await apiClient.post<ApiResponse<Payment>>(PAYMENT_BASE_PATH, data);
    return response.data.data;
  },

  getByInvoice: async (invoiceId: string): Promise<Payment[]> => {
    const response = await apiClient.get<ApiResponse<Payment[]>>(`${PAYMENT_BASE_PATH}/invoice/${invoiceId}`);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`${PAYMENT_BASE_PATH}/${id}`);
  },
};

export const insuranceClaimApi = {
  create: async (data: InsuranceClaimRequest): Promise<InsuranceClaim> => {
    const response = await apiClient.post<ApiResponse<InsuranceClaim>>(CLAIM_BASE_PATH, data);
    return response.data.data;
  },

  getById: async (id: string): Promise<InsuranceClaim> => {
    const response = await apiClient.get<ApiResponse<InsuranceClaim>>(`${CLAIM_BASE_PATH}/${id}`);
    return response.data.data;
  },

  getByPatient: async (patientId: string): Promise<InsuranceClaim[]> => {
    const response = await apiClient.get<ApiResponse<InsuranceClaim[]>>(`${CLAIM_BASE_PATH}/patient/${patientId}`);
    return response.data.data;
  },

  update: async (id: string, data: InsuranceClaimRequest): Promise<InsuranceClaim> => {
    const response = await apiClient.put<ApiResponse<InsuranceClaim>>(`${CLAIM_BASE_PATH}/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`${CLAIM_BASE_PATH}/${id}`);
  },
};