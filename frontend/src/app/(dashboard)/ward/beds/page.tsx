"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { BedGrid } from "@/components/ward/BedGrid";
import { useWards, useBedsByWard, useUpdateBedStatus } from "@/hooks/useWard";

export default function BedsOverviewPage() {
  const { data: wards } = useWards();
  const [selectedWardId, setSelectedWardId] = useState("");
  const { data: beds, isLoading } = useBedsByWard(selectedWardId || undefined);
  const updateStatusMutation = useUpdateBedStatus();

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-semibold">Beds</h1>

      <Card>
        <CardContent className="pt-6">
          <Select value={selectedWardId} onValueChange={setSelectedWardId}>
            <SelectTrigger className="w-full sm:w-80">
              <SelectValue placeholder="Select a ward to view its beds" />
            </SelectTrigger>
            <SelectContent>
              {wards?.map((w) => (
                <SelectItem key={w.id} value={w.id}>{w.wardName}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedWardId ? (
        isLoading ? (
          <LoadingSpinner />
        ) : (
          <BedGrid
            beds={beds ?? []}
            onStatusChange={(bedId, status) => updateStatusMutation.mutate({ id: bedId, status })}
          />
        )
      ) : (
        <p className="py-8 text-center text-muted-foreground">Select a ward above to view and manage its beds.</p>
      )}
    </div>
  );
}
