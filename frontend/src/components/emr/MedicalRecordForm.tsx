"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { medicalRecordSchema, MedicalRecordFormValues } from "@/schemas/emr.schema";
import { MedicalRecord, RecordType } from "@/types/emr.types";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCreateMedicalRecord, useUpdateMedicalRecord } from "@/hooks/useMedicalRecords";
import { patientApi } from "@/lib/api/patient.api";
import { doctorApi } from "@/lib/api/staff.api";
import { useDebounce } from "@/hooks/useDebounce";
import { Trash2, Plus } from "lucide-react";

interface MedicalRecordFormProps {
  record?: MedicalRecord;
  presetPatientId?: string;
}

export function MedicalRecordForm({ record, presetPatientId }: MedicalRecordFormProps) {
  const router = useRouter();
  const createMutation = useCreateMedicalRecord();
  const updateMutation = useUpdateMedicalRecord();
  const isEdit = !!record;

  const [patientQuery, setPatientQuery] = useState("");
  const debouncedPatientQuery = useDebounce(patientQuery, 400);

  const { data: patientResults } = useQuery({
    queryKey: ["patient-search-lookup", debouncedPatientQuery],
    queryFn: () => patientApi.search({ firstName: debouncedPatientQuery, size: 10 }),
    enabled: debouncedPatientQuery.length > 1 && !isEdit && !presetPatientId,
  });

  const { data: doctors } = useQuery({
    queryKey: ["doctors-lookup"],
    queryFn: () => doctorApi.getAll({ page: 0, size: 100 }),
  });

  const form = useForm<any>({
    resolver: zodResolver(medicalRecordSchema),
    defaultValues: {
      patientId: record?.patientId ?? presetPatientId ?? "",
      doctorId: record?.doctorId ?? "",
      recordDate: record?.recordDate ?? new Date().toISOString().slice(0, 10),
      description: record?.description ?? "",
      recordType: record?.recordType,
      vitals: record?.vitals ?? {},
      diagnoses: record?.diagnoses ?? [],
    },
  });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: "diagnoses" });

  async function onSubmit(values: MedicalRecordFormValues) {
    if (isEdit && record) {
      await updateMutation.mutateAsync({ id: record.id, data: values });
      router.push(`/emr/records/${record.id}`);
    } else {
      const created = await createMutation.mutateAsync(values);
      router.push(`/emr/records/${created.id}`);
    }
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending;
  const showPatientSelector = !isEdit && !presetPatientId;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Visit Details</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {showPatientSelector ? (
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
            ) : null}

            <FormField control={form.control} name="doctorId" render={({ field }) => (
              <FormItem>
                <FormLabel>Doctor</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
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

            <FormField control={form.control} name="recordDate" render={({ field }) => (
              <FormItem><FormLabel>Record Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
            )} />

            <FormField control={form.control} name="recordType" render={({ field }) => (
              <FormItem>
                <FormLabel>Record Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(RecordType).map((t) => (
                      <SelectItem key={t} value={t}>{t.replace("_", " ")}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem className="sm:col-span-2"><FormLabel>Description</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Vitals</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-5">
            <FormField control={form.control} name="vitals.temperature" render={({ field }) => (
              <FormItem><FormLabel>Temp (°C)</FormLabel><FormControl><Input type="number" step="0.1" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="vitals.heartRate" render={({ field }) => (
              <FormItem><FormLabel>Heart Rate</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="vitals.bloodPressure" render={({ field }) => (
              <FormItem><FormLabel>BP</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="vitals.weight" render={({ field }) => (
              <FormItem><FormLabel>Weight (kg)</FormLabel><FormControl><Input type="number" step="0.1" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="vitals.height" render={({ field }) => (
              <FormItem><FormLabel>Height (cm)</FormLabel><FormControl><Input type="number" step="0.1" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Diagnoses</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={() => append({ diagnosisName: "", description: "", severity: "" })}>
              <Plus className="mr-2 h-4 w-4" />
              Add Diagnosis
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.length === 0 && <p className="text-sm text-muted-foreground">No diagnoses added yet.</p>}
            {fields.map((item, index) => (
              <div key={item.id} className="grid grid-cols-1 gap-3 rounded-md border p-3 sm:grid-cols-4">
                <FormField control={form.control} name={`diagnoses.${index}.diagnosisName`} render={({ field }) => (
                  <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name={`diagnoses.${index}.description`} render={({ field }) => (
                  <FormItem><FormLabel>Description</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name={`diagnoses.${index}.severity`} render={({ field }) => (
                  <FormItem><FormLabel>Severity</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <div className="flex items-end">
                  <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : isEdit ? "Update Record" : "Create Record"}
          </Button>
        </div>
      </form>
    </Form>
  );
}