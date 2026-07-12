"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BedStatusBadge } from "./BedStatusBadge";
import { Bed, BedStatus, Admission } from "@/types/ward.types";
import { cn } from "@/lib/utils/cn";
import { User, Clipboard } from "lucide-react";

interface BedGridProps {
  beds: Bed[];
  admissions: Admission[];
  onStatusChange: (bedId: string, status: BedStatus) => void;
}

export function BedGrid({ beds, admissions, onStatusChange }: BedGridProps) {
  if (beds.length === 0) {
    return <p className="text-sm text-muted-foreground">No beds added to this ward yet.</p>;
  }

  // Group beds by room
  const roomsMap: { [key: string]: Bed[] } = {};
  beds.forEach((bed) => {
    const room = bed.roomNumber ? bed.roomNumber : "Unassigned";
    if (!roomsMap[room]) {
      roomsMap[room] = [];
    }
    roomsMap[room].push(bed);
  });

  return (
    <div className="space-y-8">
      {Object.keys(roomsMap).sort().map((roomName) => {
        const roomBeds = roomsMap[roomName];
        const totalBedsInRoom = roomBeds.length;
        const availableBedsInRoom = roomBeds.filter(b => b.status === "AVAILABLE").length;

        return (
          <div key={roomName} className="space-y-4 rounded-xl border border-muted/50 p-4 bg-muted/10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-2">
              <h3 className="text-base font-semibold">
                {roomName === "Unassigned" ? "Unassigned Beds" : `Room ${roomName}`}
              </h3>
              <p className="text-xs text-muted-foreground">
                <span className={cn(
                  "font-bold",
                  availableBedsInRoom > 0 ? "text-emerald-500" : "text-amber-500"
                )}>{availableBedsInRoom}</span> of {totalBedsInRoom} beds available
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {roomBeds.map((bed) => {
                // Find active admission if occupied
                const activeAdmission = bed.status === "OCCUPIED" 
                  ? admissions.find(adm => adm.bedId === bed.id)
                  : null;

                return (
                  <Card key={bed.id} className={cn(
                    "hover:shadow transition-shadow",
                    bed.status === "AVAILABLE" && "border-emerald-500/30"
                  )}>
                    <CardContent className="space-y-3 pt-4">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-sm">Bed {bed.bedNumber}</p>
                        <BedStatusBadge status={bed.status} />
                      </div>

                      {activeAdmission ? (
                        <div className="space-y-1 rounded bg-amber-500/10 dark:bg-amber-950/20 p-2 text-xs">
                          <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-medium">
                            <User className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate">{activeAdmission.patientName}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                            <Clipboard className="h-3 w-3 shrink-0" />
                            <span className="truncate">Dr. {activeAdmission.doctorName}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="h-9 flex items-center justify-center border border-dashed rounded text-[11px] text-muted-foreground bg-muted/20">
                          Empty Bed
                        </div>
                      )}

                      <Select value={bed.status} onValueChange={(v) => onStatusChange(bed.id, v as BedStatus)}>
                        <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {Object.values(BedStatus).map((s) => (
                            <SelectItem key={s} value={s}>{s.replace("_", " ")}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
