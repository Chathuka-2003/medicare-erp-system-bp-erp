"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { medicineSchema, MedicineFormValues } from "@/schemas/pharmacy.schema";
import { Medicine, MedicineCategory, MedicineRequest } from "@/types/pharmacy.types";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCreateMedicine, useUpdateMedicine } from "@/hooks/usePharmacy";

interface MedicineFormProps {
    medicine?: Medicine;
}

type MedicineFormInput = z.input<typeof medicineSchema>;

export function MedicineForm({ medicine }: MedicineFormProps) {
    const router = useRouter();
    const createMutation = useCreateMedicine();
    const updateMutation = useUpdateMedicine();
    const isEdit = !!medicine;

    const form = useForm<MedicineFormInput, unknown, MedicineFormValues>({
        resolver: zodResolver(medicineSchema),
        defaultValues: {
            medicineCode: medicine?.medicineCode ?? "",
            medicineName: medicine?.medicineName ?? "",
            genericName: medicine?.genericName ?? "",
            manufacturer: medicine?.manufacturer ?? "",
            category: medicine?.category ?? MedicineCategory.OTHER,
            dosageForm: medicine?.dosageForm ?? "",
            strength: medicine?.strength ?? "",
            unitPrice: medicine?.unitPrice ?? 0,
        },
    });

    async function onSubmit(values: MedicineFormValues) {
        const payload: MedicineRequest = values;

        try {
            if (isEdit && medicine) {
                await updateMutation.mutateAsync({ id: medicine.id, data: payload });
                router.push(`/pharmacy/medicines/${medicine.id}`);
            } else {
                const created = await createMutation.mutateAsync(payload);
                router.push(`/pharmacy/medicines/${created.id}`);
            }
        } catch {
            // Mutation hook shows a toast; keep failed submissions from becoming uncaught promise errors.
        }
    }

    const isSubmitting = createMutation.isPending || updateMutation.isPending;

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Card>
                    <CardHeader><CardTitle>Medicine Details</CardTitle></CardHeader>
                    <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <FormField control={form.control} name="medicineCode" render={({ field }) => (
                            <FormItem><FormLabel>Medicine Code</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="medicineName" render={({ field }) => (
                            <FormItem><FormLabel>Medicine Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="genericName" render={({ field }) => (
                            <FormItem><FormLabel>Generic Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="manufacturer" render={({ field }) => (
                            <FormItem><FormLabel>Manufacturer</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="category" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value ?? MedicineCategory.OTHER}>
                                    <FormControl>
                                        <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {Object.values(MedicineCategory).map((c) => (
                                            <SelectItem key={c} value={c}>{c.replace("_", " ")}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="dosageForm" render={({ field }) => (
                            <FormItem><FormLabel>Dosage Form</FormLabel><FormControl><Input placeholder="e.g. Tablet, Syrup" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="strength" render={({ field }) => (
                            <FormItem><FormLabel>Strength</FormLabel><FormControl><Input placeholder="e.g. 500mg" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="unitPrice" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Unit Price</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        name={field.name}
                                        ref={field.ref}
                                        onBlur={field.onBlur}
                                        value={field.value == null ? "" : String(field.value)}
                                        onChange={field.onChange}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-3">
                    <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Saving..." : isEdit ? "Update Medicine" : "Create Medicine"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
