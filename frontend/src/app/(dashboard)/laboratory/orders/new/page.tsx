"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { labOrderSchema, LabOrderFormValues } from "@/schemas/laboratory.schema";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useCreateLabOrder, useLabTests } from "@/hooks/useLaboratory";
import { patientApi } from "@/lib/api/patient.api";
import { doctorApi } from "@/lib/api/staff.api";
import { useDebounce } from "@/hooks/useDebounce";
import { formatCurrency } from "@/lib/utils/format";

export default function NewLabOrderPage() {
  const router = useRouter();
  const createMutation = useCreateLabOrder();

  const [patientQuery, setPatientQuery] = useState("");
  const debouncedPatientQuery = useDebounce(patientQuery, 400);

  const { data: patientResults } = useQuery({
    queryKey: ["patient-search-lookup", debouncedPatientQuery],
    queryFn: () => patientApi.search({ firstName: debouncedPatientQuery, size: 10 }),
    enabled: debouncedPatientQuery.length > 1,
  });

  const { data: doctors } = useQuery({
    queryKey: ["doctors-lookup"],
    queryFn: () => doctorApi.getAll({ page: 0, size: 100 }),
  });

  const { data: labTests } = useLabTests({ page: 0, size: 100 });

  const form = useForm<any>({
    resolver: zodResolver(labOrderSchema),
    defaultValues: {
      patientId: "",
      doctorId: "",
      labTestIds: [],
    },
  });

  const selectedTestIds: string[] = form.watch("labTestIds") ?? [];

  function toggleTest(testId: string, checked: boolean) {
    const current: string[] = form.getValues("labTestIds") ?? [];
    if (checked) {
      form.setValue("labTestIds", [...current, testId]);
    } else {
      form.setValue("labTestIds", current.filter((id) => id !== testId));
    }
  }

  async function onSubmit(values: LabOrderFormValues) {
    const created = await createMutation.mutateAsync(values);
    router.push(`/laboratory/orders/${created.id}`);
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-semibold">New Lab Order</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Order Details</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField control={form.control} name="patientId" render={({ field }) => (
                <FormItem>
                  <FormLabel>Patient</FormLabel>
                  <Input
                    placeholder="Type to search patient by first name..."
                    value={patientQuery}
                    onChange={(e) => setPatientQuery(e.target.value)}
                  />
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Select patient" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {patientResults?.content.map((p) => (
                        <SelectItem key={p.id} value={p.id}>{p.firstName} {p.lastName} ({p.patientNumber})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="doctorId" render={({ field }) => (
                <FormItem>
                  <FormLabel>Doctor</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Select doctor" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {doctors?.content.map((d) => (
                        <SelectItem key={d.id} value={d.id}>Dr. {d.firstName} {d.lastName}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Select Tests</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {labTests?.content.map((test) => (
                <label key={test.id} className="flex items-center gap-3 rounded-md border p-3 text-sm">
                  <Checkbox
                    checked={selectedTestIds.includes(test.id)}
                    onCheckedChange={(checked) => toggleTest(test.id, !!checked)}
                  />
                  <span className="flex-1">{test.testName} ({test.testCode})</span>
                  <span className="text-muted-foreground">{formatCurrency(test.price)}</span>
                </label>
              ))}
              {form.formState.errors.labTestIds && (
                <p className="text-sm text-destructive">{form.formState.errors.labTestIds.message as string}</p>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? "Creating..." : "Create Order"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}