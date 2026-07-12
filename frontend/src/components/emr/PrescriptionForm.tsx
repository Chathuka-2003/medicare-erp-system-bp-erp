"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { prescriptionSchema, PrescriptionFormValues } from "@/schemas/emr.schema";
import { Prescription } from "@/types/emr.types";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCreatePrescription, useUpdatePrescription } from "@/hooks/useMedicalRecords";
import { Trash2, Plus } from "lucide-react";

interface PrescriptionFormProps {
  medicalRecordId: string;
  prescription?: Prescription;
  onSaved?: () => void;
}

export function PrescriptionForm({ medicalRecordId, prescription, onSaved }: PrescriptionFormProps) {
  const createMutation = useCreatePrescription();
  const updateMutation = useUpdatePrescription();
  const isEdit = !!prescription;

  const form = useForm<any>({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: {
      notes: prescription?.notes ?? "",
      items: prescription?.items ?? [{ medicineName: "", dosage: "", frequency: "", duration: 1 }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: "items" });

  async function onSubmit(values: PrescriptionFormValues) {
    if (isEdit && prescription) {
      await updateMutation.mutateAsync({ id: prescription.id, data: values });
    } else {
      await createMutation.mutateAsync({ medicalRecordId, data: values });
    }
    onSaved?.();
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Prescription Items</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={() => append({ medicineName: "", dosage: "", frequency: "", duration: 1 })}>
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.map((item, index) => (
              <div key={item.id} className="grid grid-cols-1 gap-3 rounded-md border p-3 sm:grid-cols-5">
                <FormField control={form.control} name={`items.${index}.medicineName`} render={({ field }) => (
                  <FormItem><FormLabel>Medicine</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name={`items.${index}.dosage`} render={({ field }) => (
                  <FormItem><FormLabel>Dosage</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name={`items.${index}.frequency`} render={({ field }) => (
                  <FormItem><FormLabel>Frequency</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name={`items.${index}.duration`} render={({ field }) => (
                  <FormItem><FormLabel>Duration (days)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <div className="flex items-end">
                  <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} disabled={fields.length === 1}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
            <FormField control={form.control} name="notes" render={({ field }) => (
              <FormItem><FormLabel>Notes</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : isEdit ? "Update Prescription" : "Create Prescription"}
          </Button>
        </div>
      </form>
    </Form>
  );
}