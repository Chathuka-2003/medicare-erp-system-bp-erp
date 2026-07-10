import { apiClient } from "./client";
import { ApiResponse } from "@/types/common.types";
import { Report, ReportRequest, ReportType, DashboardStats } from "@/types/reports.types";

const REPORT_BASE_PATH = "/reports";
const DASHBOARD_BASE_PATH = "/dashboard";

export const reportApi = {
  save: async (data: ReportRequest): Promise<Report> => {
    const response = await apiClient.post<ApiResponse<Report>>(REPORT_BASE_PATH, data);
    return response.data.data;
  },

  getById: async (id: string): Promise<Report> => {
    const response = await apiClient.get<ApiResponse<Report>>(`${REPORT_BASE_PATH}/${id}`);
    return response.data.data;
  },

  getAll: async (): Promise<Report[]> => {
    const response = await apiClient.get<ApiResponse<Report[]>>(REPORT_BASE_PATH);
    return response.data.data;
  },

  getByType: async (reportType: ReportType): Promise<Report[]> => {
    const response = await apiClient.get<ApiResponse<Report[]>>(`${REPORT_BASE_PATH}/type/${reportType}`);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`${REPORT_BASE_PATH}/${id}`);
  },
};

export const dashboardApi = {
  getSummary: async (): Promise<DashboardStats> => {
    const response = await apiClient.get<ApiResponse<DashboardStats>>(DASHBOARD_BASE_PATH);
    return response.data.data;
  },
};
