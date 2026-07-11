"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { purchaseOrderSchema, PurchaseOrderFormValues } from "@/schemas/inventory.schema";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCreatePurchaseOrder, useSuppliers, useItems } from "@/hooks/useInventory";
import { Trash2, Plus } from "lucide-react";

export function PurchaseOrderForm() {
  const router = useRouter();
  const createMutation = useCreatePurchaseOrder();
  const { data: suppliers } = useSuppliers();
  const { data: items } = useItems({ page: 0, size: 100 });

  const form = useForm<any>({
    resolver: zodResolver(purchaseOrderSchema),
    defaultValues: {
      supplierId: "",
      orderDate: new Date().toISOString().slice(0, 10),
      expectedDeliveryDate: "",
      items: [{ itemId: "", quantity: 1, unitPrice: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: "items" });

  async function onSubmit(values: PurchaseOrderFormValues) {
    const created = await createMutation.mutateAsync(values);
    router.push(`/inventory/purchase-orders/${created.id}`);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Order Details</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField control={form.control} name="supplierId" render={({ field }) => (
              <FormItem>
                <FormLabel>Supplier</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="Select supplier" /></SelectTrigger>
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
            <FormField control={form.control} name="orderDate" render={({ field }) => (
              <FormItem><FormLabel>Order Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="expectedDeliveryDate" render={({ field }) => (
              <FormItem><FormLabel>Expected Delivery</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Items</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={() => append({ itemId: "", quantity: 1, unitPrice: 0 })}>
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-1 gap-3 rounded-md border p-3 sm:grid-cols-4">
                <FormField control={form.control} name={`items.${index}.itemId`} render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Item</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select item" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {items?.content.map((i) => (
                          <SelectItem key={i.id} value={i.id}>{i.itemName} ({i.itemCode})</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name={`items.${index}.quantity`} render={({ field }) => (
                  <FormItem><FormLabel>Qty</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name={`items.${index}.unitPrice`} render={({ field }) => (
                  <FormItem><FormLabel>Unit Price</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <div className="flex items-end sm:col-span-4">
                  <Button type="button" variant="ghost" size="sm" onClick={() => remove(index)} disabled={fields.length === 1}>
                    <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" disabled={createMutation.isPending}>
            {createMutation.isPending ? "Creating..." : "Create Purchase Order"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
