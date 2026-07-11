"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BedStatusBadge } from "./BedStatusBadge";
import { Bed, BedStatus } from "@/types/ward.types";
import { cn } from "@/lib/utils/cn";

interface BedGridProps {
  beds: Bed[];
  onStatusChange: (bedId: string, status: BedStatus) => void;
}

export function BedGrid({ beds, onStatusChange }: BedGridProps) {
  if (beds.length === 0) {
    return <p className="text-sm text-muted-foreground">No beds added to this ward yet.</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {beds.map((bed) => (
        <Card key={bed.id} className={cn(bed.status === "AVAILABLE" && "border-success/40")}>
          <CardContent className="space-y-2 pt-4">
            <p className="font-medium">Bed {bed.bedNumber}</p>
            {bed.roomNumber && <p className="text-xs text-muted-foreground">Room {bed.roomNumber}</p>}
            <BedStatusBadge status={bed.status} />
            <Select value={bed.status} onValueChange={(v) => onStatusChange(bed.id, v as BedStatus)}>
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.values(BedStatus).map((s) => (
                  <SelectItem key={s} value={s}>{s.replace("_", " ")}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
