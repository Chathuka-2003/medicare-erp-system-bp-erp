"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { wardSchema, WardFormValues } from "@/schemas/ward.schema";
import { Ward, WardType } from "@/types/ward.types";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCreateWard, useUpdateWard } from "@/hooks/useWard";

interface WardFormProps {
  ward?: Ward;
}

export function WardForm({ ward }: WardFormProps) {
  const router = useRouter();
  const createMutation = useCreateWard();
  const updateMutation = useUpdateWard();
  const isEdit = !!ward;

  const form = useForm<any>({
    resolver: zodResolver(wardSchema),
    defaultValues: {
      wardCode: ward?.wardCode ?? "",
      wardName: ward?.wardName ?? "",
      wardType: ward?.wardType,
      totalBeds: ward?.totalBeds ?? undefined,
      floor: ward?.floor ?? "",
      description: ward?.description ?? "",
    },
  });

  async function onSubmit(values: WardFormValues) {
    if (isEdit && ward) {
      await updateMutation.mutateAsync({ id: ward.id, data: values });
    } else {
      await createMutation.mutateAsync(values);
    }
    router.push("/ward/wards");
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Ward Details</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField control={form.control} name="wardCode" render={({ field }) => (
              <FormItem><FormLabel>Ward Code</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="wardName" render={({ field }) => (
              <FormItem><FormLabel>Ward Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="wardType" render={({ field }) => (
              <FormItem>
                <FormLabel>Ward Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(WardType).map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="totalBeds" render={({ field }) => (
              <FormItem>
                <FormLabel>Total Beds</FormLabel>
                <FormControl><Input type="number" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="floor" render={({ field }) => (
              <FormItem><FormLabel>Floor</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem className="sm:col-span-2"><FormLabel>Description</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : isEdit ? "Update Ward" : "Create Ward"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
