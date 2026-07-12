import { z } from "zod";
import { PaymentMethod } from "@/types/billing.types";

const invoiceItemSchema = z.object({
  itemName: z.string().min(1, "Item name is required"),
  quantity: z.coerce.number().int().positive("Quantity must be positive"),
  unitPrice: z.coerce.number().positive("Unit price must be positive"),
});

export const invoiceSchema = z.object({
  patientId: z.string().min(1, "Patient is required"),
  appointmentId: z.string().optional(),
  invoiceDate: z.string().min(1, "Invoice date is required"),
  dueDate: z.string().optional(),
  items: z.array(invoiceItemSchema).min(1, "At least one item is required"),
});

export type InvoiceFormValues = z.infer<typeof invoiceSchema>;

export const paymentSchema = z.object({
  invoiceId: z.string().min(1, "Invoice is required"),
  amount: z.coerce.number().positive("Amount must be positive"),
  paymentDate: z.string().optional(),
  paymentMethod: z.nativeEnum(PaymentMethod, { error: "Payment method is required" }),
  remarks: z.string().optional(),
});

export type PaymentFormValues = z.infer<typeof paymentSchema>;

export const insuranceClaimSchema = z.object({
  patientId: z.string().min(1, "Patient is required"),
  invoiceId: z.string().optional(),
  insuranceProvider: z.string().min(1, "Insurance provider is required"),
  claimAmount: z.coerce.number().positive("Claim amount must be positive"),
  approvedAmount: z.coerce.number().optional(),
  claimDate: z.string().min(1, "Claim date is required"),
  settlementDate: z.string().optional(),
  status: z.string().optional(),
});

export type InsuranceClaimFormValues = z.infer<typeof insuranceClaimSchema>;