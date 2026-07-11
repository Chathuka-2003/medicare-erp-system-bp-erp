"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMedicine, useMedicineStock, useAddMedicineStock } from "@/hooks/usePharmacy";
import { medicineStockSchema, MedicineStockFormValues } from "@/schemas/pharmacy.schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { StockLevelBadge } from "@/components/pharmacy/StockLevelBadge";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import { Pencil, Plus } from "lucide-react";

export default function MedicineDetailPage() {
    const params = useParams();
    const router = useRouter();
    const medicineId = params.id as string;

    const { data: medicine, isLoading } = useMedicine(medicineId);
    const { data: stockBatches, isLoading: stockLoading } = useMedicineStock(medicineId);
    const addStockMutation = useAddMedicineStock();
    const [showAddStock, setShowAddStock] = useState(false);

    const form = useForm<any>({
        resolver: zodResolver(medicineStockSchema),
        defaultValues: {
            batchNumber: "",
            quantityInStock: undefined,
            reorderLevel: undefined,
            manufactureDate: "",
            expiryDate: "",
            storageLocation: "",
        },
    });

    async function onSubmit(values: MedicineStockFormValues) {
        await addStockMutation.mutateAsync({ medicineId, data: values });
        form.reset();
        setShowAddStock(false);
    }

    if (isLoading) return <LoadingSpinner />;
    if (!medicine) return <p className="p-6">Medicine not found.</p>;

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">{medicine.medicineName}</h1>
                    <p className="text-sm text-muted-foreground">{medicine.medicineCode} · {formatCurrency(medicine.unitPrice)}</p>
                </div>
                <Button variant="outline" onClick={() => router.push(`/pharmacy/medicines/${medicine.id}/edit`)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit Medicine
                </Button>
            </div>

            <Card>
                <CardHeader><CardTitle>Overview</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <p><span className="text-muted-foreground">Category:</span> {medicine.category.replace("_", " ")}</p>
                    <p><span className="text-muted-foreground">Generic Name:</span> {medicine.genericName ?? "—"}</p>
                    <p><span className="text-muted-foreground">Manufacturer:</span> {medicine.manufacturer ?? "—"}</p>
                    <p><span className="text-muted-foreground">Dosage Form:</span> {medicine.dosageForm ?? "—"} {medicine.strength ?? ""}</p>
                    <p><StockLevelBadge totalStock={medicine.totalStock} /></p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Stock Batches</CardTitle>
                    <Button variant="outline" size="sm" onClick={() => setShowAddStock(!showAddStock)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Stock
                    </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                    {showAddStock && (
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 gap-3 rounded-md border p-3 sm:grid-cols-3">
                                <FormField control={form.control} name="batchNumber" render={({ field }) => (
                                    <FormItem><FormLabel>Batch Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="quantityInStock" render={({ field }) => (
                                    <FormItem><FormLabel>Quantity</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="reorderLevel" render={({ field }) => (
                                    <FormItem><FormLabel>Reorder Level</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="manufactureDate" render={({ field }) => (
                                    <FormItem><FormLabel>Manufacture Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="expiryDate" render={({ field }) => (
                                    <FormItem><FormLabel>Expiry Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="storageLocation" render={({ field }) => (
                                    <FormItem><FormLabel>Storage Location</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <div className="flex items-end sm:col-span-3">
                                    <Button type="submit" disabled={addStockMutation.isPending}>
                                        {addStockMutation.isPending ? "Saving..." : "Save Batch"}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    )}

                    {stockLoading ? (
                        <LoadingSpinner />
                    ) : stockBatches && stockBatches.length > 0 ? (
                        <div className="space-y-2">
                            {stockBatches.map((batch) => (
                                <div key={batch.id} className="flex items-center justify-between rounded-md border p-3 text-sm">
                                    <div>
                                        <p className="font-medium">Batch {batch.batchNumber}</p>
                                        <p className="text-muted-foreground">Expires: {formatDate(batch.expiryDate)}</p>
                                    </div>
                                    <p className="font-medium">{batch.quantityInStock} units</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">No stock batches recorded yet.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}