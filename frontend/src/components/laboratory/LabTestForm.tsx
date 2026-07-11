"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { labTestSchema, LabTestFormValues } from "@/schemas/laboratory.schema";
import { LabTest } from "@/types/laboratory.types";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCreateLabTest, useUpdateLabTest } from "@/hooks/useLaboratory";

interface LabTestFormProps {
  labTest?: LabTest;
}

export function LabTestForm({ labTest }: LabTestFormProps) {
  const router = useRouter();
  const createMutation = useCreateLabTest();
  const updateMutation = useUpdateLabTest();
  const isEdit = !!labTest;

  const form = useForm<any>({
    resolver: zodResolver(labTestSchema),
    defaultValues: {
      testCode: labTest?.testCode ?? "",
      testName: labTest?.testName ?? "",
      category: labTest?.category ?? "",
      description: labTest?.description ?? "",
      price: labTest?.price ?? undefined,
      sampleType: labTest?.sampleType ?? "",
      normalRange: labTest?.normalRange ?? "",
    },
  });

  async function onSubmit(values: LabTestFormValues) {
    if (isEdit && labTest) {
      await updateMutation.mutateAsync({ id: labTest.id, data: values });
    } else {
      await createMutation.mutateAsync(values);
    }
    router.push("/laboratory/tests");
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Test Details</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField control={form.control} name="testCode" render={({ field }) => (
              <FormItem><FormLabel>Test Code</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="testName" render={({ field }) => (
              <FormItem><FormLabel>Test Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="category" render={({ field }) => (
              <FormItem><FormLabel>Category</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="price" render={({ field }) => (
              <FormItem><FormLabel>Price</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="sampleType" render={({ field }) => (
              <FormItem><FormLabel>Sample Type</FormLabel><FormControl><Input placeholder="e.g. Blood, Urine" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="normalRange" render={({ field }) => (
              <FormItem><FormLabel>Normal Range</FormLabel><FormControl><Input placeholder="e.g. 70-100 mg/dL" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem className="sm:col-span-2"><FormLabel>Description</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : isEdit ? "Update Test" : "Create Test"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
