import { z } from "zod";
import { MedicineCategory } from "@/types/pharmacy.types";

export const medicineSchema = z.object({
    medicineCode: z.string().min(1, "Medicine code is required"),
    medicineName: z.string().min(1, "Medicine name is required"),
    genericName: z.string().optional(),
    manufacturer: z.string().optional(),
    category: z.nativeEnum(MedicineCategory, { error: "Category is required" }),
    dosageForm: z.string().optional(),
    strength: z.string().optional(),
    unitPrice: z.coerce.number().positive("Unit price must be positive"),
});

export type MedicineFormValues = z.infer<typeof medicineSchema>;

export const medicineStockSchema = z.object({
    batchNumber: z.string().min(1, "Batch number is required"),
    quantityInStock: z.coerce.number().int().positive("Quantity must be positive"),
    reorderLevel: z.coerce.number().int().optional(),
    manufactureDate: z.string().optional(),
    expiryDate: z.string().min(1, "Expiry date is required"),
    storageLocation: z.string().optional(),
});

export type MedicineStockFormValues = z.infer<typeof medicineStockSchema>;

const dispenseItemSchema = z.object({
    medicineId: z.string().min(1, "Medicine is required"),
    quantity: z.coerce.number().int().positive("Quantity must be positive"),
    dosage: z.string().optional(),
    instructions: z.string().optional(),
});

export const drugDispenseSchema = z.object({
    patientId: z.string().min(1, "Patient is required"),
    prescriptionId: z.string().optional(),
    pharmacistId: z.string().min(1, "Pharmacist is required"),
    remarks: z.string().optional(),
    items: z.array(dispenseItemSchema).min(1, "At least one item is required"),
});

export type DrugDispenseFormValues = z.infer<typeof drugDispenseSchema>;