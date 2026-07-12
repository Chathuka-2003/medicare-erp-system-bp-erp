"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { itemSchema, ItemFormValues } from "@/schemas/inventory.schema";
import { Item, ItemCategory } from "@/types/inventory.types";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCreateItem, useUpdateItem, useSuppliers } from "@/hooks/useInventory";

interface ItemFormProps {
  item?: Item;
}

export function ItemForm({ item }: ItemFormProps) {
  const router = useRouter();
  const createMutation = useCreateItem();
  const updateMutation = useUpdateItem();
  const { data: suppliers } = useSuppliers();
  const isEdit = !!item;

  const form = useForm<any>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      itemCode: item?.itemCode ?? "",
      itemName: item?.itemName ?? "",
      category: item?.category,
      unit: item?.unit ?? "",
      quantityInStock: item?.quantityInStock ?? 0,
      reorderLevel: item?.reorderLevel ?? undefined,
      purchasePrice: item?.purchasePrice ?? undefined,
      sellingPrice: item?.sellingPrice ?? undefined,
      storageLocation: item?.storageLocation ?? "",
      supplierId: item?.supplierId ?? "",
    },
  });

  async function onSubmit(values: ItemFormValues) {
    if (isEdit && item) {
      await updateMutation.mutateAsync({ id: item.id, data: values });
    } else {
      await createMutation.mutateAsync(values);
    }
    router.push("/inventory/items");
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Item Details</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField control={form.control} name="itemCode" render={({ field }) => (
              <FormItem><FormLabel>Item Code</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="itemName" render={({ field }) => (
              <FormItem><FormLabel>Item Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="category" render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(ItemCategory).map((c) => (
                      <SelectItem key={c} value={c}>{c.replace("_", " ")}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="unit" render={({ field }) => (
              <FormItem><FormLabel>Unit</FormLabel><FormControl><Input placeholder="e.g. box, pack, piece" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="quantityInStock" render={({ field }) => (
              <FormItem><FormLabel>Quantity in Stock</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="reorderLevel" render={({ field }) => (
              <FormItem><FormLabel>Reorder Level</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="purchasePrice" render={({ field }) => (
              <FormItem><FormLabel>Purchase Price</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="sellingPrice" render={({ field }) => (
              <FormItem><FormLabel>Selling Price</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="storageLocation" render={({ field }) => (
              <FormItem><FormLabel>Storage Location</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="supplierId" render={({ field }) => (
              <FormItem>
                <FormLabel>Supplier</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="Select supplier (optional)" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {suppliers?.map((s) => (
                      <SelectItem key={s.id} value={s.id}>{s.supplierName}</SelectItem>
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
            {isSubmitting ? "Saving..." : isEdit ? "Update Item" : "Create Item"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
