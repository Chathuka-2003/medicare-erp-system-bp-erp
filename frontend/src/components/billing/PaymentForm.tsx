"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { paymentSchema, PaymentFormValues } from "@/schemas/billing.schema";
import { PaymentMethod } from "@/types/billing.types";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRecordPayment } from "@/hooks/useBilling";

interface PaymentFormProps {
  invoiceId: string;
  maxAmount: number;
  onSaved?: () => void;
}

export function PaymentForm({ invoiceId, maxAmount, onSaved }: PaymentFormProps) {
  const recordMutation = useRecordPayment();

  const form = useForm<any>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      invoiceId,
      amount: undefined,
      paymentMethod: undefined,
      remarks: "",
    },
  });

  async function onSubmit(values: PaymentFormValues) {
    if (values.amount > maxAmount) {
      form.setError("amount", { message: `Amount cannot exceed the outstanding balance (${maxAmount})` });
      return;
    }
    await recordMutation.mutateAsync(values);
    form.reset({ invoiceId, amount: undefined, paymentMethod: undefined, remarks: "" });
    onSaved?.();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <FormField control={form.control} name="amount" render={({ field }) => (
          <FormItem><FormLabel>Amount</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="paymentMethod" render={({ field }) => (
          <FormItem>
            <FormLabel>Method</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger><SelectValue placeholder="Select method" /></SelectTrigger>
              </FormControl>
              <SelectContent>
                {Object.values(PaymentMethod).map((m) => (
                  <SelectItem key={m} value={m}>{m.replace("_", " ")}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="remarks" render={({ field }) => (
          <FormItem><FormLabel>Remarks</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <div className="flex items-end">
          <Button type="submit" disabled={recordMutation.isPending} className="w-full">
            {recordMutation.isPending ? "Recording..." : "Record Payment"}
          </Button>
        </div>
      </form>
    </Form>
  );
}