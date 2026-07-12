"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { reportApi, dashboardApi } from "@/lib/api/reports.api";
import { ReportRequest, ReportType } from "@/types/reports.types";

const REPORTS_KEY = "reports";
const DASHBOARD_KEY = "dashboard";

export function useDashboardStats() {
  return useQuery({
    queryKey: [DASHBOARD_KEY],
    queryFn: () => dashboardApi.getSummary(),
    refetchInterval: 60_000, // refresh every minute since this reflects live cross-module data
  });
}

export function useReports() {
  return useQuery({ queryKey: [REPORTS_KEY, "all"], queryFn: () => reportApi.getAll() });
}

export function useReportsByType(reportType: ReportType | undefined) {
  return useQuery({
    queryKey: [REPORTS_KEY, "type", reportType],
    queryFn: () => reportApi.getByType(reportType as ReportType),
    enabled: !!reportType,
  });
}

export function useSaveReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ReportRequest) => reportApi.save(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [REPORTS_KEY] });
      toast.success("Report saved successfully");
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? "Failed to save report"),
  });
}

export function useDeleteReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => reportApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [REPORTS_KEY] });
      toast.success("Report deleted successfully");
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? "Failed to delete report"),
  });
}
