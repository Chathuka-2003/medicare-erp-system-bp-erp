"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { admissionSchema, AdmissionFormValues } from "@/schemas/ward.schema";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdmitPatient, useWards, useAvailableBedsByWard } from "@/hooks/useWard";
import { patientApi } from "@/lib/api/patient.api";
import { doctorApi } from "@/lib/api/staff.api";
import { useDebounce } from "@/hooks/useDebounce";

export function AdmissionForm() {
  const router = useRouter();
  const admitMutation = useAdmitPatient();

  const [patientQuery, setPatientQuery] = useState("");
  const [selectedWardId, setSelectedWardId] = useState("");
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

  const { data: wards } = useWards();
  const { data: availableBeds } = useAvailableBedsByWard(selectedWardId || undefined);

  const form = useForm<any>({
    resolver: zodResolver(admissionSchema),
    defaultValues: {
      patientId: "",
      doctorId: "",
      bedId: "",
      diagnosis: "",
      remarks: "",
    },
  });

  async function onSubmit(values: AdmissionFormValues) {
    const created = await admitMutation.mutateAsync(values);
    router.push(`/ward/admissions/${created.id}`);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Admission Details</CardTitle></CardHeader>
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

            <FormItem>
              <FormLabel>Ward</FormLabel>
              <Select value={selectedWardId} onValueChange={setSelectedWardId}>
                <SelectTrigger><SelectValue placeholder="Select ward" /></SelectTrigger>
                <SelectContent>
                  {wards?.map((w) => (
                    <SelectItem key={w.id} value={w.id}>{w.wardName} ({w.availableBeds} beds available)</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>

            <FormField control={form.control} name="bedId" render={({ field }) => (
              <FormItem>
                <FormLabel>Bed</FormLabel>
                <Select onValueChange={field.onChange} value={field.value} disabled={!selectedWardId}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="Select available bed" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {availableBeds?.map((bed) => (
                      <SelectItem key={bed.id} value={bed.id}>Bed {bed.bedNumber} {bed.roomNumber && `(Room ${bed.roomNumber})`}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="diagnosis" render={({ field }) => (
              <FormItem className="sm:col-span-2"><FormLabel>Diagnosis</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="remarks" render={({ field }) => (
              <FormItem className="sm:col-span-2"><FormLabel>Remarks</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" disabled={admitMutation.isPending}>
            {admitMutation.isPending ? "Admitting..." : "Admit Patient"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
