import { apiClient } from "./client";
import { ApiResponse } from "@/types/common.types";
import { Ward, WardRequest, Bed, BedRequest, Admission, AdmissionRequest, BedStatus } from "@/types/ward.types";

const WARD_BASE_PATH = "/wards";
const BED_BASE_PATH = "/beds";
const ADMISSION_BASE_PATH = "/admissions";

export const wardApi = {
  create: async (data: WardRequest): Promise<Ward> => {
    const response = await apiClient.post<ApiResponse<Ward>>(WARD_BASE_PATH, data);
    return response.data.data;
  },

  getById: async (id: string): Promise<Ward> => {
    const response = await apiClient.get<ApiResponse<Ward>>(`${WARD_BASE_PATH}/${id}`);
    return response.data.data;
  },

  getAll: async (): Promise<Ward[]> => {
    const response = await apiClient.get<ApiResponse<Ward[]>>(WARD_BASE_PATH);
    return response.data.data;
  },

  update: async (id: string, data: WardRequest): Promise<Ward> => {
    const response = await apiClient.put<ApiResponse<Ward>>(`${WARD_BASE_PATH}/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`${WARD_BASE_PATH}/${id}`);
  },
};

export const bedApi = {
  create: async (data: BedRequest): Promise<Bed> => {
    const response = await apiClient.post<ApiResponse<Bed>>(BED_BASE_PATH, data);
    return response.data.data;
  },

  getById: async (id: string): Promise<Bed> => {
    const response = await apiClient.get<ApiResponse<Bed>>(`${BED_BASE_PATH}/${id}`);
    return response.data.data;
  },

  getByWard: async (wardId: string): Promise<Bed[]> => {
    const response = await apiClient.get<ApiResponse<Bed[]>>(`${BED_BASE_PATH}/ward/${wardId}`);
    return response.data.data;
  },

  getAvailableByWard: async (wardId: string): Promise<Bed[]> => {
    const response = await apiClient.get<ApiResponse<Bed[]>>(`${BED_BASE_PATH}/ward/${wardId}/available`);
    return response.data.data;
  },

  updateStatus: async (id: string, status: BedStatus): Promise<Bed> => {
    const response = await apiClient.patch<ApiResponse<Bed>>(`${BED_BASE_PATH}/${id}/status`, null, { params: { status } });
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`${BED_BASE_PATH}/${id}`);
  },
};

export const admissionApi = {
  admit: async (data: AdmissionRequest): Promise<Admission> => {
    const response = await apiClient.post<ApiResponse<Admission>>(ADMISSION_BASE_PATH, data);
    return response.data.data;
  },

  getById: async (id: string): Promise<Admission> => {
    const response = await apiClient.get<ApiResponse<Admission>>(`${ADMISSION_BASE_PATH}/${id}`);
    return response.data.data;
  },

  getByPatient: async (patientId: string): Promise<Admission[]> => {
    const response = await apiClient.get<ApiResponse<Admission[]>>(`${ADMISSION_BASE_PATH}/patient/${patientId}`);
    return response.data.data;
  },

  getCurrent: async (): Promise<Admission[]> => {
    const response = await apiClient.get<ApiResponse<Admission[]>>(`${ADMISSION_BASE_PATH}/current`);
    return response.data.data;
  },

  discharge: async (id: string): Promise<Admission> => {
    const response = await apiClient.patch<ApiResponse<Admission>>(`${ADMISSION_BASE_PATH}/${id}/discharge`);
    return response.data.data;
  },
};
