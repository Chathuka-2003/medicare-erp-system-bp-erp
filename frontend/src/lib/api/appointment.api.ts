import { apiClient } from "./client";
import { ApiResponse, PageResponse } from "@/types/common.types";
import { Appointment, AppointmentRequest, AppointmentStatus } from "@/types/appointment.types";

const BASE_PATH = "/appointments";

export const appointmentApi = {
    create: async (data: AppointmentRequest): Promise<Appointment> => {
        const response = await apiClient.post<ApiResponse<Appointment>>(BASE_PATH, data);
        return response.data.data;
    },

    getById: async (id: string): Promise<Appointment> => {
        const response = await apiClient.get<ApiResponse<Appointment>>(`${BASE_PATH}/${id}`);
        return response.data.data;
    },

    getAll: async (params: {
        page?: number;
        size?: number;
        sortBy?: string;
        sortDirection?: "ASC" | "DESC";
    }): Promise<PageResponse<Appointment>> => {
        const response = await apiClient.get<ApiResponse<PageResponse<Appointment>>>(BASE_PATH, { params });
        return response.data.data;
    },

    getByPatient: async (patientId: string): Promise<Appointment[]> => {
        const response = await apiClient.get<ApiResponse<Appointment[]>>(`${BASE_PATH}/patient/${patientId}`);
        return response.data.data;
    },

    getByDoctor: async (doctorId: string): Promise<Appointment[]> => {
        const response = await apiClient.get<ApiResponse<Appointment[]>>(`${BASE_PATH}/doctor/${doctorId}`);
        return response.data.data;
    },

    update: async (id: string, data: AppointmentRequest): Promise<Appointment> => {
        const response = await apiClient.put<ApiResponse<Appointment>>(`${BASE_PATH}/${id}`, data);
        return response.data.data;
    },

    updateStatus: async (id: string, status: AppointmentStatus): Promise<Appointment> => {
        const response = await apiClient.patch<ApiResponse<Appointment>>(
            `${BASE_PATH}/${id}/status`,
            null,
            { params: { status } }
        );
        return response.data.data;
    },

    cancel: async (id: string): Promise<void> => {
        await apiClient.patch(`${BASE_PATH}/${id}/cancel`);
    },

    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`${BASE_PATH}/${id}`);
    },
};