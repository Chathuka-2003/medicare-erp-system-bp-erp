"use client";

import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useSaveReport } from "@/hooks/useReports";
import { ReportType } from "@/types/reports.types";
import { Download } from "lucide-react";

interface ExportButtonProps {
  reportName: string;
  reportType: ReportType;
  reportParameters?: string;
}

export function ExportButton({ reportName, reportType, reportParameters }: ExportButtonProps) {
  const { data: session } = useSession();
  const saveMutation = useSaveReport();

  async function handleSave() {
    if (!session?.user?.id) return;
    await saveMutation.mutateAsync({
      reportName,
      reportType,
      reportParameters,
      generatedById: session.user.id,
    });
  }

  return (
    <Button variant="outline" onClick={handleSave} disabled={saveMutation.isPending}>
      <Download className="mr-2 h-4 w-4" />
      {saveMutation.isPending ? "Saving..." : "Save Report"}
    </Button>
  );
}
