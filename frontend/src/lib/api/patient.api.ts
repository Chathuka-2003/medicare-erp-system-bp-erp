import { apiClient } from "./client";
import { ApiResponse, PageResponse } from "@/types/common.types";
import { Patient, PatientRequest, PatientSearchParams } from "@/types/patient.types";

const BASE_PATH = "/patients";

export const patientApi = {
  create: async (data: PatientRequest): Promise<Patient> => {
    const response = await apiClient.post<ApiResponse<Patient>>(BASE_PATH, data);
    return response.data.data;
  },

  getById: async (id: string): Promise<Patient> => {
    const response = await apiClient.get<ApiResponse<Patient>>(`${BASE_PATH}/${id}`);
    return response.data.data;
  },

  getByPatientNumber: async (patientNumber: string): Promise<Patient> => {
    const response = await apiClient.get<ApiResponse<Patient>>(`${BASE_PATH}/number/${patientNumber}`);
    return response.data.data;
  },

  getAll: async (params: {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDirection?: "ASC" | "DESC";
  }): Promise<PageResponse<Patient>> => {
    const response = await apiClient.get<ApiResponse<PageResponse<Patient>>>(BASE_PATH, { params });
    return response.data.data;
  },

  search: async (params: PatientSearchParams): Promise<PageResponse<Patient>> => {
    const response = await apiClient.get<ApiResponse<PageResponse<Patient>>>(`${BASE_PATH}/search`, { params });
    return response.data.data;
  },

  update: async (id: string, data: PatientRequest): Promise<Patient> => {
    const response = await apiClient.put<ApiResponse<Patient>>(`${BASE_PATH}/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`${BASE_PATH}/${id}`);
  },
};