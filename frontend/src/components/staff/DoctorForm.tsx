"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { doctorSchema, DoctorFormValues } from "@/schemas/staff.schema";
import { Doctor } from "@/types/staff.types";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCreateDoctor, useUpdateDoctor } from "@/hooks/useStaff";
import { ROUTES } from "@/lib/constants/routes";
import { staffLookupApi } from "@/lib/api/staff.api";

interface DoctorFormProps {
  doctor?: Doctor;
}

export function DoctorForm({ doctor }: DoctorFormProps) {
  const router = useRouter();
  const createMutation = useCreateDoctor();
  const updateMutation = useUpdateDoctor();
  const isEdit = !!doctor;
  const { data: departments = [], isLoading: isLoadingDepartments } = useQuery({
    queryKey: ["departments-lookup"],
    queryFn: staffLookupApi.getDepartments,
  });
  const { data: specializations = [], isLoading: isLoadingSpecializations } = useQuery({
    queryKey: ["specializations-lookup"],
    queryFn: staffLookupApi.getSpecializations,
  });

  const form = useForm<DoctorFormValues>({
    resolver: zodResolver(doctorSchema),
    defaultValues: {
      firstName: doctor?.firstName ?? "",
      lastName: doctor?.lastName ?? "",
      licenseNumber: doctor?.licenseNumber ?? "",
      email: doctor?.email ?? "",
      phone: doctor?.phone ?? "",
      departmentId: doctor?.departmentId ?? "",
      specializationId: doctor?.specializationId ?? "",
    },
  });

  async function onSubmit(values: DoctorFormValues) {
    try {
      if (isEdit && doctor) {
        await updateMutation.mutateAsync({ id: doctor.id, data: values });
      } else {
        await createMutation.mutateAsync(values);
      }
      router.push(ROUTES.STAFF_DOCTORS);
    } catch {
      // Mutation hooks already show a toast. Keeping the rejection handled prevents noisy console crashes.
    }
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Doctor Details</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField control={form.control} name="firstName" render={({ field }) => (
              <FormItem><FormLabel>First Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="lastName" render={({ field }) => (
              <FormItem><FormLabel>Last Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="licenseNumber" render={({ field }) => (
              <FormItem><FormLabel>License Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="email" render={({ field }) => (
              <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="phone" render={({ field }) => (
              <FormItem><FormLabel>Phone</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="departmentId" render={({ field }) => (
              <FormItem>
                <FormLabel>Department</FormLabel>
                <Select onValueChange={field.onChange} value={field.value ?? ""} disabled={isLoadingDepartments}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {isLoadingDepartments && <SelectItem value="loading-departments" disabled>Loading departments...</SelectItem>}
                    {!isLoadingDepartments && departments.length === 0 && <SelectItem value="no-departments" disabled>No departments found</SelectItem>}
                    {departments.map((department) => (
                      <SelectItem key={department.id} value={department.id}>{department.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="specializationId" render={({ field }) => (
              <FormItem>
                <FormLabel>Specialization</FormLabel>
                <Select onValueChange={field.onChange} value={field.value ?? ""} disabled={isLoadingSpecializations}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="Select specialization" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {isLoadingSpecializations && <SelectItem value="loading-specializations" disabled>Loading specializations...</SelectItem>}
                    {!isLoadingSpecializations && specializations.length === 0 && <SelectItem value="no-specializations" disabled>No specializations found</SelectItem>}
                    {specializations.map((specialization) => (
                      <SelectItem key={specialization.id} value={specialization.id}>{specialization.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>Optional.</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : isEdit ? "Update Doctor" : "Create Doctor"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
