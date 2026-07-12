"use client";
import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insuranceClaimSchema, InsuranceClaimFormValues } from "@/schemas/billing.schema";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCreateInsuranceClaim } from "@/hooks/useBilling";

function NewInsuranceClaimContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const patientId = searchParams.get("patientId") ?? "";
  const createMutation = useCreateInsuranceClaim();
  const form = useForm<any>({
    resolver: zodResolver(insuranceClaimSchema),
    defaultValues: {
      patientId,
      invoiceId: "",
      insuranceProvider: "",
      claimAmount: undefined,
      approvedAmount: undefined,
      claimDate: new Date().toISOString().slice(0, 10),
      settlementDate: "",
      status: "SUBMITTED",
    },
  });
  async function onSubmit(values: InsuranceClaimFormValues) {
    await createMutation.mutateAsync(values);
    router.push(`/billing/insurance-claims`);
  }
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-semibold">New Insurance Claim</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Claim Details</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField control={form.control} name="insuranceProvider" render={({ field }) => (
                <FormItem><FormLabel>Insurance Provider</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="claimAmount" render={({ field }) => (
                <FormItem><FormLabel>Claim Amount</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="claimDate" render={({ field }) => (
                <FormItem><FormLabel>Claim Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="status" render={({ field }) => (
                <FormItem><FormLabel>Status</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </CardContent>
          </Card>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? "Saving..." : "Create Claim"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default function NewInsuranceClaimPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <NewInsuranceClaimContent />
    </Suspense>
  );
}
