import { apiClient } from "./client";
import { ApiResponse, PageResponse } from "@/types/common.types";
import { LabTest, LabTestRequest, LabOrder, LabOrderRequest, LabResult, LabResultRequest } from "@/types/laboratory.types";

const LAB_TEST_BASE_PATH = "/lab-tests";
const LAB_RESULT_BASE_PATH = "/lab-results";

export const labTestApi = {
  create: async (data: LabTestRequest): Promise<LabTest> => {
    const response = await apiClient.post<ApiResponse<LabTest>>(LAB_TEST_BASE_PATH, data);
    return response.data.data;
  },

  getById: async (id: string): Promise<LabTest> => {
    const response = await apiClient.get<ApiResponse<LabTest>>(`${LAB_TEST_BASE_PATH}/${id}`);
    return response.data.data;
  },

  getAll: async (params: {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDirection?: "ASC" | "DESC";
  }): Promise<PageResponse<LabTest>> => {
    const response = await apiClient.get<ApiResponse<PageResponse<LabTest>>>(LAB_TEST_BASE_PATH, { params });
    return response.data.data;
  },

  update: async (id: string, data: LabTestRequest): Promise<LabTest> => {
    const response = await apiClient.put<ApiResponse<LabTest>>(`${LAB_TEST_BASE_PATH}/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`${LAB_TEST_BASE_PATH}/${id}`);
  },
};

export const labResultApi = {
  createOrder: async (data: LabOrderRequest): Promise<LabOrder> => {
    const response = await apiClient.post<ApiResponse<LabOrder>>(`${LAB_RESULT_BASE_PATH}/orders`, data);
    return response.data.data;
  },

  getOrderById: async (id: string): Promise<LabOrder> => {
    const response = await apiClient.get<ApiResponse<LabOrder>>(`${LAB_RESULT_BASE_PATH}/orders/${id}`);
    return response.data.data;
  },

  getOrdersByPatient: async (patientId: string): Promise<LabOrder[]> => {
    const response = await apiClient.get<ApiResponse<LabOrder[]>>(`${LAB_RESULT_BASE_PATH}/orders/patient/${patientId}`);
    return response.data.data;
  },

  recordResult: async (data: LabResultRequest): Promise<LabResult> => {
    const response = await apiClient.post<ApiResponse<LabResult>>(LAB_RESULT_BASE_PATH, data);
    return response.data.data;
  },

  getResultByOrderItem: async (labOrderItemId: string): Promise<LabResult> => {
    const response = await apiClient.get<ApiResponse<LabResult>>(`${LAB_RESULT_BASE_PATH}/order-item/${labOrderItemId}`);
    return response.data.data;
  },
};
