import { apiClient } from "./client";
import { ApiResponse, PageResponse } from "@/types/common.types";
import { DepartmentLookup, Doctor, DoctorRequest, SpecializationLookup, Staff, StaffRequest } from "@/types/staff.types";

const DOCTOR_BASE_PATH = "/doctors";
const STAFF_BASE_PATH = "/staff";

export const staffLookupApi = {
  getDepartments: async (): Promise<DepartmentLookup[]> => {
    const response = await apiClient.get<ApiResponse<DepartmentLookup[]>>("/departments");
    return response.data.data;
  },

  getSpecializations: async (): Promise<SpecializationLookup[]> => {
    const response = await apiClient.get<ApiResponse<SpecializationLookup[]>>("/specializations");
    return response.data.data;
  },
};

export const doctorApi = {
  create: async (data: DoctorRequest): Promise<Doctor> => {
    const response = await apiClient.post<ApiResponse<Doctor>>(DOCTOR_BASE_PATH, data);
    return response.data.data;
  },

  getById: async (id: string): Promise<Doctor> => {
    const response = await apiClient.get<ApiResponse<Doctor>>(`${DOCTOR_BASE_PATH}/${id}`);
    return response.data.data;
  },

  getAll: async (params: {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDirection?: "ASC" | "DESC";
  }): Promise<PageResponse<Doctor>> => {
    const response = await apiClient.get<ApiResponse<PageResponse<Doctor>>>(DOCTOR_BASE_PATH, { params });
    return response.data.data;
  },

  getByDepartment: async (departmentId: string): Promise<Doctor[]> => {
    const response = await apiClient.get<ApiResponse<Doctor[]>>(`${DOCTOR_BASE_PATH}/department/${departmentId}`);
    return response.data.data;
  },

  update: async (id: string, data: DoctorRequest): Promise<Doctor> => {
    const response = await apiClient.put<ApiResponse<Doctor>>(`${DOCTOR_BASE_PATH}/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`${DOCTOR_BASE_PATH}/${id}`);
  },
};

export const staffApi = {
  create: async (data: StaffRequest): Promise<Staff> => {
    const response = await apiClient.post<ApiResponse<Staff>>(STAFF_BASE_PATH, data);
    return response.data.data;
  },

  getById: async (id: string): Promise<Staff> => {
    const response = await apiClient.get<ApiResponse<Staff>>(`${STAFF_BASE_PATH}/${id}`);
    return response.data.data;
  },

  getAll: async (params: {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDirection?: "ASC" | "DESC";
  }): Promise<PageResponse<Staff>> => {
    const response = await apiClient.get<ApiResponse<PageResponse<Staff>>>(STAFF_BASE_PATH, { params });
    return response.data.data;
  },

  getByDepartment: async (departmentId: string): Promise<Staff[]> => {
    const response = await apiClient.get<ApiResponse<Staff[]>>(`${STAFF_BASE_PATH}/department/${departmentId}`);
    return response.data.data;
  },

  update: async (id: string, data: StaffRequest): Promise<Staff> => {
    const response = await apiClient.put<ApiResponse<Staff>>(`${STAFF_BASE_PATH}/${id}`, data);
    return response.data.data;
  },

  deactivate: async (id: string): Promise<void> => {
    await apiClient.patch(`${STAFF_BASE_PATH}/${id}/deactivate`);
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`${STAFF_BASE_PATH}/${id}`);
  },
};
