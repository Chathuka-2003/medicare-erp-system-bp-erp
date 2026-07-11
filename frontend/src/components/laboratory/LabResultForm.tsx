"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { labResultSchema, LabResultFormValues } from "@/schemas/laboratory.schema";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRecordLabResult } from "@/hooks/useLaboratory";
import { staffApi } from "@/lib/api/staff.api";

interface LabResultFormProps {
  labOrderItemId: string;
  onSaved?: () => void;
}

export function LabResultForm({ labOrderItemId, onSaved }: LabResultFormProps) {
  const recordMutation = useRecordLabResult();

  const { data: staffList } = useQuery({
    queryKey: ["staff-lookup"],
    queryFn: () => staffApi.getAll({ page: 0, size: 100 }),
  });

  const form = useForm<any>({
    resolver: zodResolver(labResultSchema),
    defaultValues: {
      labOrderItemId,
      resultValue: "",
      remarks: "",
      verifiedById: "",
    },
  });

  async function onSubmit(values: LabResultFormValues) {
    await recordMutation.mutateAsync(values);
    onSaved?.();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 gap-3 rounded-md border p-3 sm:grid-cols-4">
        <FormField control={form.control} name="resultValue" render={({ field }) => (
          <FormItem className="sm:col-span-2"><FormLabel>Result Value</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="verifiedById" render={({ field }) => (
          <FormItem>
            <FormLabel>Verified By</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger><SelectValue placeholder="Select staff" /></SelectTrigger>
              </FormControl>
              <SelectContent>
                {staffList?.content
                  .filter((s) => s.role === "LAB_TECHNICIAN" || s.role === "DOCTOR")
                  .map((s) => (
                    <SelectItem key={s.id} value={s.id}>{s.firstName} {s.lastName}</SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="remarks" render={({ field }) => (
          <FormItem><FormLabel>Remarks</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <div className="flex items-end sm:col-span-4">
          <Button type="submit" disabled={recordMutation.isPending}>
            {recordMutation.isPending ? "Saving..." : "Save Result"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
