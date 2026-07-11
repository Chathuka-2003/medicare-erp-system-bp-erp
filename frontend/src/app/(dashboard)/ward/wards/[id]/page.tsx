"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useWard, useBedsByWard, useCreateBed, useUpdateBedStatus } from "@/hooks/useWard";
import { bedSchema, BedFormValues } from "@/schemas/ward.schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { BedGrid } from "@/components/ward/BedGrid";
import { Pencil, Plus } from "lucide-react";

export default function WardDetailPage() {
  const params = useParams();
  const router = useRouter();
  const wardId = params.id as string;

  const { data: ward, isLoading } = useWard(wardId);
  const { data: beds, isLoading: bedsLoading } = useBedsByWard(wardId);
  const createBedMutation = useCreateBed();
  const updateStatusMutation = useUpdateBedStatus();
  const [showAddBed, setShowAddBed] = useState(false);

  const form = useForm<any>({
    resolver: zodResolver(bedSchema),
    defaultValues: { wardId, bedNumber: "", roomNumber: "" },
  });

  async function onSubmit(values: BedFormValues) {
    await createBedMutation.mutateAsync(values);
    form.reset({ wardId, bedNumber: "", roomNumber: "" });
    setShowAddBed(false);
  }

  if (isLoading) return <LoadingSpinner />;
  if (!ward) return <p className="p-6">Ward not found.</p>;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{ward.wardName}</h1>
          <p className="text-sm text-muted-foreground">{ward.wardCode} · {ward.wardType} · {ward.availableBeds}/{ward.totalBeds} beds available</p>
        </div>
        <Button variant="outline" onClick={() => router.push(`/ward/wards/${ward.id}/edit`)}>
          <Pencil className="mr-2 h-4 w-4" />
          Edit Ward
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Beds</CardTitle>
          <Button variant="outline" size="sm" onClick={() => setShowAddBed(!showAddBed)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Bed
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {showAddBed && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-3 rounded-md border p-3">
                <FormField control={form.control} name="bedNumber" render={({ field }) => (
                  <FormItem className="flex-1"><FormLabel>Bed Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="roomNumber" render={({ field }) => (
                  <FormItem className="flex-1"><FormLabel>Room Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <div className="flex items-end">
                  <Button type="submit" disabled={createBedMutation.isPending}>Save</Button>
                </div>
              </form>
            </Form>
          )}

          {bedsLoading ? (
            <LoadingSpinner />
          ) : (
            <BedGrid
              beds={beds ?? []}
              onStatusChange={(bedId, status) => updateStatusMutation.mutate({ id: bedId, status })}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
