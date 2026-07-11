"use client";

import { useState } from "react";
import { useReports, useReportsByType, useDeleteReport } from "@/hooks/useReports";
import { ReportFilters } from "@/components/reports/ReportFilters";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { EmptyState } from "@/components/common/EmptyState";
import { ReportType } from "@/types/reports.types";
import { formatDateTime } from "@/lib/utils/format";
import { Trash2 } from "lucide-react";

export default function ReportsPage() {
  const [filter, setFilter] = useState<ReportType | "ALL">("ALL");

  const allReports = useReports();
  const filteredReports = useReportsByType(filter !== "ALL" ? filter : undefined);
  const deleteMutation = useDeleteReport();

  const isLoading = filter === "ALL" ? allReports.isLoading : filteredReports.isLoading;
  const reports = filter === "ALL" ? allReports.data : filteredReports.data;

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-semibold">Reports</h1>

      <Card>
        <CardContent className="pt-6">
          <ReportFilters value={filter} onChange={setFilter} />
        </CardContent>
      </Card>

      {isLoading ? (
        <LoadingSpinner />
      ) : !reports || reports.length === 0 ? (
        <EmptyState title="No reports found" description="Saved reports from any module will appear here." />
      ) : (
        <div className="space-y-3">
          {reports.map((report) => (
            <Card key={report.id}>
              <CardContent className="flex items-center justify-between pt-6">
                <div>
                  <p className="font-medium">{report.reportName}</p>
                  <p className="text-sm text-muted-foreground">
                    {report.reportType.replace("_", " ")} · {report.generatedByName}
                    {report.generatedAt && ` · ${formatDateTime(report.generatedAt)}`}
                  </p>
                  {report.description && <p className="mt-1 text-sm">{report.description}</p>}
                </div>
                <Button
                  variant="ghost" size="icon"
                  onClick={() => {
                    if (confirm("Delete this report?")) deleteMutation.mutate(report.id);
                  }}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
