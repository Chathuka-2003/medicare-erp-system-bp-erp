"use client";

import { useParams } from "next/navigation";
import { useReportsByType } from "@/hooks/useReports";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { EmptyState } from "@/components/common/EmptyState";
import { ExportButton } from "@/components/reports/ExportButton";
import { ReportType } from "@/types/reports.types";
import { formatDateTime } from "@/lib/utils/format";

export default function ReportsByTypePage() {
  const params = useParams();
  const reportType = (params.type as string).toUpperCase() as ReportType;
  const { data: reports, isLoading } = useReportsByType(reportType);

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{reportType.replace("_", " ")} Reports</h1>
        <ExportButton reportName={`${reportType.replace("_", " ")} — ${new Date().toLocaleDateString()}`} reportType={reportType} />
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : !reports || reports.length === 0 ? (
        <EmptyState title="No reports of this type yet" />
      ) : (
        <div className="space-y-3">
          {reports.map((report) => (
            <Card key={report.id}>
              <CardContent className="pt-6">
                <p className="font-medium">{report.reportName}</p>
                <p className="text-sm text-muted-foreground">
                  {report.generatedByName} {report.generatedAt && `· ${formatDateTime(report.generatedAt)}`}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
