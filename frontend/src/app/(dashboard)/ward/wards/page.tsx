"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { EmptyState } from "@/components/common/EmptyState";
import { useWards, useDeleteWard } from "@/hooks/useWard";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function WardsPage() {
  const router = useRouter();
  const { data: wards, isLoading } = useWards();
  const deleteMutation = useDeleteWard();

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Wards</h1>
        <Button onClick={() => router.push("/ward/wards/new")}>
          <Plus className="mr-2 h-4 w-4" />
          New Ward
        </Button>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : !wards || wards.length === 0 ? (
        <EmptyState title="No wards found" />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {wards.map((ward) => (
            <Card key={ward.id} className="cursor-pointer" onClick={() => router.push(`/ward/wards/${ward.id}`)}>
              <CardContent className="space-y-2 pt-6">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{ward.wardName}</p>
                  <span className="text-xs text-muted-foreground">{ward.wardCode}</span>
                </div>
                <p className="text-sm text-muted-foreground">{ward.wardType} {ward.floor && `· Floor ${ward.floor}`}</p>
                <p className="text-sm">
                  <span className="font-medium">{ward.availableBeds}</span> / {ward.totalBeds} beds available
                </p>
                <div className="flex justify-end gap-1">
                  <Button
                    variant="ghost" size="icon"
                    onClick={(e) => { e.stopPropagation(); router.push(`/ward/wards/${ward.id}/edit`); }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost" size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm("Delete this ward?")) deleteMutation.mutate(ward.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
