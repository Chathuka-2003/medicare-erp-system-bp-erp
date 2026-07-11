"use client";

import { useState } from "react";
import { useResultByOrderItem } from "@/hooks/useLaboratory";
import { LabResultForm } from "./LabResultForm";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/utils/format";
import { CheckCircle2 } from "lucide-react";

interface LabResultViewProps {
  labOrderItemId: string;
  testName: string;
  resultAvailable: boolean;
}

export function LabResultView({ labOrderItemId, testName, resultAvailable }: LabResultViewProps) {
  const { data: result, isLoading } = useResultByOrderItem(resultAvailable ? labOrderItemId : undefined);
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="rounded-md border p-3">
      <div className="flex items-center justify-between">
        <p className="font-medium">{testName}</p>
        {resultAvailable && !isLoading && result && (
          <span className="flex items-center gap-1 text-sm text-success">
            <CheckCircle2 className="h-4 w-4" />
            Completed
          </span>
        )}
      </div>

      {resultAvailable && result ? (
        <div className="mt-2 space-y-1 text-sm">
          <p><span className="text-muted-foreground">Result:</span> {result.resultValue}</p>
          {result.remarks && <p><span className="text-muted-foreground">Remarks:</span> {result.remarks}</p>}
          <p className="text-xs text-muted-foreground">
            Verified by {result.verifiedByName} {result.completedDate && `· ${formatDateTime(result.completedDate)}`}
          </p>
        </div>
      ) : showForm ? (
        <div className="mt-3">
          <LabResultForm labOrderItemId={labOrderItemId} onSaved={() => setShowForm(false)} />
        </div>
      ) : (
        <Button variant="outline" size="sm" className="mt-2" onClick={() => setShowForm(true)}>
          Record Result
        </Button>
      )}
    </div>
  );
}
