"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { staffSchema, staffCreateSchema, StaffFormValues } from "@/schemas/staff.schema";
import { Staff, StaffRequest } from "@/types/staff.types";
import { UserRole } from "@/types/auth.types";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCreateStaff, useUpdateStaff } from "@/hooks/useStaff";
import { ROUTES } from "@/lib/constants/routes";
import { staffLookupApi } from "@/lib/api/staff.api";

interface StaffFormProps {
  staff?: Staff;
}

export function StaffForm({ staff }: StaffFormProps) {
  const router = useRouter();
  const createMutation = useCreateStaff();
  const updateMutation = useUpdateStaff();
  const isEdit = !!staff;
  const { data: departments = [], isLoading: isLoadingDepartments } = useQuery({
    queryKey: ["departments-lookup"],
    queryFn: staffLookupApi.getDepartments,
  });

  const form = useForm<StaffFormValues>({
    resolver: zodResolver(isEdit ? staffSchema : staffCreateSchema),
    defaultValues: {
      firstName: staff?.firstName ?? "",
      lastName: staff?.lastName ?? "",
      email: staff?.email ?? "",
      phone: staff?.phone ?? "",
      employeeNumber: staff?.employeeNumber ?? "",
      password: "",
      role: staff?.role,
      active: staff?.active ?? true,
      departmentId: staff?.departmentId ?? "",
      doctorId: staff?.doctorId ?? "",
    },
  });

  async function onSubmit(values: StaffFormValues) {
    const payload: StaffRequest = { ...values };
    if (isEdit && !payload.password) {
      delete payload.password; // don't overwrite password if left blank on edit
    }

    try {
      if (isEdit && staff) {
        await updateMutation.mutateAsync({ id: staff.id, data: payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      router.push(ROUTES.STAFF_EMPLOYEES);
    } catch {
      // Mutation hooks already show the user-facing error toast.
    }
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Staff Details</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField control={form.control} name="firstName" render={({ field }) => (
              <FormItem><FormLabel>First Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="lastName" render={({ field }) => (
              <FormItem><FormLabel>Last Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="email" render={({ field }) => (
              <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="phone" render={({ field }) => (
              <FormItem><FormLabel>Phone</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="employeeNumber" render={({ field }) => (
              <FormItem><FormLabel>Employee Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="password" render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl><Input type="password" {...field} /></FormControl>
                <FormDescription>{isEdit ? "Leave blank to keep the current password." : "Minimum 8 characters."}</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="role" render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(UserRole).filter((r) => r !== UserRole.PATIENT).map((r) => (
                      <SelectItem key={r} value={r}>{r.replace("_", " ")}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
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
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : isEdit ? "Update Staff Member" : "Create Staff Member"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
