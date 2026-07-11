"use client";

import { useState } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { invoiceSchema, InvoiceFormValues } from "@/schemas/billing.schema";
import { Invoice, InvoiceRequest } from "@/types/billing.types";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCreateInvoice, useUpdateInvoice } from "@/hooks/useBilling";
import { patientApi } from "@/lib/api/patient.api";
import { useDebounce } from "@/hooks/useDebounce";
import { formatCurrency } from "@/lib/utils/format";
import { Trash2, Plus } from "lucide-react";

interface InvoiceFormProps {
  invoice?: Invoice;
}

type InvoiceFormInput = z.input<typeof invoiceSchema>;

export function InvoiceForm({ invoice }: InvoiceFormProps) {
  const router = useRouter();
  const createMutation = useCreateInvoice();
  const updateMutation = useUpdateInvoice();
  const isEdit = !!invoice;

  const [patientQuery, setPatientQuery] = useState("");
  const debouncedQuery = useDebounce(patientQuery, 400);

  const {
    data: patientResults,
    isLoading: isLoadingPatients,
    isError: isPatientLookupError,
  } = useQuery({
    queryKey: ["patient-search-lookup", debouncedQuery],
    queryFn: () =>
      debouncedQuery.length > 1
        ? patientApi.search({ firstName: debouncedQuery, size: 10 })
        : patientApi.getAll({ page: 0, size: 10, sortBy: "firstName", sortDirection: "ASC" }),
    enabled: !isEdit,
  });

  const form = useForm<InvoiceFormInput, unknown, InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      patientId: invoice?.patientId ?? "",
      appointmentId: invoice?.appointmentId ?? "",
      invoiceDate: invoice?.invoiceDate ?? new Date().toISOString().slice(0, 10),
      dueDate: invoice?.dueDate ?? "",
      items: invoice?.items?.map((i) => ({ itemName: i.itemName, quantity: i.quantity, unitPrice: i.unitPrice }))
        ?? [{ itemName: "", quantity: 1, unitPrice: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: "items" });
  const watchedItems = useWatch({ control: form.control, name: "items" }) ?? [];
  const estimatedTotal = watchedItems.reduce(
    (sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0),
    0
  );

  async function onSubmit(values: InvoiceFormValues) {
    const payload: InvoiceRequest = {
      ...values,
      appointmentId: values.appointmentId || undefined,
      dueDate: values.dueDate || undefined,
    };

    try {
      if (isEdit && invoice) {
        await updateMutation.mutateAsync({ id: invoice.id, data: payload });
        router.push(`/billing/invoices/${invoice.id}`);
      } else {
        const created = await createMutation.mutateAsync(payload);
        router.push(`/billing/invoices/${created.id}`);
      }
    } catch {
      // Mutation hook shows a toast; keep failed submissions from becoming uncaught promise errors.
    }
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending;
  const patientOptions = patientResults?.content ?? [];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Invoice Details</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {!isEdit ? (
              <FormField control={form.control} name="patientId" render={({ field }) => (
                <FormItem>
                  <FormLabel>Patient</FormLabel>
                  <Input
                    placeholder="Type to search patient by first name..."
                    value={patientQuery}
                    onChange={(e) => setPatientQuery(e.target.value)}
                  />
                  <Select onValueChange={field.onChange} value={field.value ?? ""} disabled={isLoadingPatients || isPatientLookupError}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Select patient" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isLoadingPatients && <SelectItem value="loading-patients" disabled>Loading patients...</SelectItem>}
                      {isPatientLookupError && <SelectItem value="patient-error" disabled>Unable to load patients</SelectItem>}
                      {!isLoadingPatients && !isPatientLookupError && patientOptions.length === 0 && (
                        <SelectItem value="no-patients" disabled>No patients found</SelectItem>
                      )}
                      {patientOptions.map((p) => (
                        <SelectItem key={p.id} value={p.id}>{p.firstName} {p.lastName} ({p.patientNumber})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            ) : (
              <FormItem>
                <FormLabel>Patient</FormLabel>
                <Input value={invoice.patientName} disabled />
              </FormItem>
            )}

            <FormField control={form.control} name="invoiceDate" render={({ field }) => (
              <FormItem><FormLabel>Invoice Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
            )} />

            <FormField control={form.control} name="dueDate" render={({ field }) => (
              <FormItem><FormLabel>Due Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Invoice Items</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={() => append({ itemName: "", quantity: 1, unitPrice: 0 })}>
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.map((item, index) => (
              <div key={item.id} className="grid grid-cols-1 gap-3 rounded-md border p-3 sm:grid-cols-4">
                <FormField control={form.control} name={`items.${index}.itemName`} render={({ field }) => (
                  <FormItem className="sm:col-span-2"><FormLabel>Item</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name={`items.${index}.quantity`} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Qty</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
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
                <FormField control={form.control} name={`items.${index}.unitPrice`} render={({ field }) => (
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
                <div className="flex items-end sm:col-span-4">
                  <Button type="button" variant="ghost" size="sm" onClick={() => remove(index)} disabled={fields.length === 1}>
                    <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                    Remove
                  </Button>
                </div>
              </div>
            ))}
            <div className="flex justify-end border-t pt-4">
              <p className="text-lg font-semibold">Estimated Total: {formatCurrency(estimatedTotal)}</p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : isEdit ? "Update Invoice" : "Create Invoice"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
