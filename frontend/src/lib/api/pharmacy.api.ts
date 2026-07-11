import { apiClient } from "./client";
import { ApiResponse, PageResponse } from "@/types/common.types";
import {
    Medicine, MedicineRequest, MedicineStock, MedicineStockRequest,
    DrugDispense, DrugDispenseRequest,
} from "@/types/pharmacy.types";

const MEDICINE_BASE_PATH = "/medicines";
const DISPENSE_BASE_PATH = "/drug-dispenses";

export const medicineApi = {
    create: async (data: MedicineRequest): Promise<Medicine> => {
        const response = await apiClient.post<ApiResponse<Medicine>>(MEDICINE_BASE_PATH, data);
        return response.data.data;
    },

    getById: async (id: string): Promise<Medicine> => {
        const response = await apiClient.get<ApiResponse<Medicine>>(`${MEDICINE_BASE_PATH}/${id}`);
        return response.data.data;
    },

    getAll: async (params: {
        page?: number;
        size?: number;
        sortBy?: string;
        sortDirection?: "ASC" | "DESC";
    }): Promise<PageResponse<Medicine>> => {
        const response = await apiClient.get<ApiResponse<PageResponse<Medicine>>>(MEDICINE_BASE_PATH, { params });
        return response.data.data;
    },

    update: async (id: string, data: MedicineRequest): Promise<Medicine> => {
        const response = await apiClient.put<ApiResponse<Medicine>>(`${MEDICINE_BASE_PATH}/${id}`, data);
        return response.data.data;
    },

    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`${MEDICINE_BASE_PATH}/${id}`);
    },

    addStock: async (medicineId: string, data: MedicineStockRequest): Promise<MedicineStock> => {
        const response = await apiClient.post<ApiResponse<MedicineStock>>(`${MEDICINE_BASE_PATH}/${medicineId}/stock`, data);
        return response.data.data;
    },

    getStock: async (medicineId: string): Promise<MedicineStock[]> => {
        const response = await apiClient.get<ApiResponse<MedicineStock[]>>(`${MEDICINE_BASE_PATH}/${medicineId}/stock`);
        return response.data.data;
    },
};

export const drugDispenseApi = {
    create: async (data: DrugDispenseRequest): Promise<DrugDispense> => {
        const response = await apiClient.post<ApiResponse<DrugDispense>>(DISPENSE_BASE_PATH, data);
        return response.data.data;
    },

    getById: async (id: string): Promise<DrugDispense> => {
        const response = await apiClient.get<ApiResponse<DrugDispense>>(`${DISPENSE_BASE_PATH}/${id}`);
        return response.data.data;
    },

    getByPatient: async (patientId: string): Promise<DrugDispense[]> => {
        const response = await apiClient.get<ApiResponse<DrugDispense[]>>(`${DISPENSE_BASE_PATH}/patient/${patientId}`);
        return response.data.data;
    },
};