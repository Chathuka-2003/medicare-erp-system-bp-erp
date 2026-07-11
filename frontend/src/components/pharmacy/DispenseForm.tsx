"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { drugDispenseSchema, DrugDispenseFormValues } from "@/schemas/pharmacy.schema";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCreateDrugDispense } from "@/hooks/usePharmacy";
import { useMedicines } from "@/hooks/usePharmacy";
import { patientApi } from "@/lib/api/patient.api";
import { staffApi } from "@/lib/api/staff.api";
import { useDebounce } from "@/hooks/useDebounce";
import { Trash2, Plus } from "lucide-react";

export function DispenseForm() {
    const router = useRouter();
    const createMutation = useCreateDrugDispense();

    const [patientQuery, setPatientQuery] = useState("");
    const debouncedPatientQuery = useDebounce(patientQuery, 400);

    const { data: patientResults } = useQuery({
        queryKey: ["patient-search-lookup", debouncedPatientQuery],
        queryFn: () => patientApi.search({ firstName: debouncedPatientQuery, size: 10 }),
        enabled: debouncedPatientQuery.length > 1,
    });

    const { data: medicines } = useMedicines({ page: 0, size: 100 });

    const { data: pharmacists } = useQuery({
        queryKey: ["pharmacists-lookup"],
        queryFn: () => staffApi.getAll({ page: 0, size: 100 }),
    });

    const form = useForm<any>({
        resolver: zodResolver(drugDispenseSchema),
        defaultValues: {
            patientId: "",
            pharmacistId: "",
            remarks: "",
            items: [{ medicineId: "", quantity: 1, dosage: "", instructions: "" }],
        },
    });

    const { fields, append, remove } = useFieldArray({ control: form.control, name: "items" });

    async function onSubmit(values: DrugDispenseFormValues) {
        const created = await createMutation.mutateAsync(values);
        router.push(`/pharmacy/dispense`);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Card>
                    <CardHeader><CardTitle>Dispense Details</CardTitle></CardHeader>
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

                        <FormField control={form.control} name="pharmacistId" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Pharmacist</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger><SelectValue placeholder="Select pharmacist" /></SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {pharmacists?.content.filter((s) => s.role === "PHARMACIST").map((s) => (
                                            <SelectItem key={s.id} value={s.id}>{s.firstName} {s.lastName}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="remarks" render={({ field }) => (
                            <FormItem className="sm:col-span-2"><FormLabel>Remarks</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Items</CardTitle>
                        <Button type="button" variant="outline" size="sm" onClick={() => append({ medicineId: "", quantity: 1, dosage: "", instructions: "" })}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Item
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {fields.map((item, index) => (
                            <div key={item.id} className="grid grid-cols-1 gap-3 rounded-md border p-3 sm:grid-cols-5">
                                <FormField control={form.control} name={`items.${index}.medicineId`} render={({ field }) => (
                                    <FormItem className="sm:col-span-2">
                                        <FormLabel>Medicine</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger><SelectValue placeholder="Select medicine" /></SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {medicines?.content.map((m) => (
                                                    <SelectItem key={m.id} value={m.id}>{m.medicineName} ({m.totalStock} in stock)</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name={`items.${index}.quantity`} render={({ field }) => (
                                    <FormItem><FormLabel>Qty</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name={`items.${index}.dosage`} render={({ field }) => (
                                    <FormItem><FormLabel>Dosage</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <div className="flex items-end">
                                    <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} disabled={fields.length === 1}>
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-3">
                    <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                    <Button type="submit" disabled={createMutation.isPending}>
                        {createMutation.isPending ? "Dispensing..." : "Dispense Drugs"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}