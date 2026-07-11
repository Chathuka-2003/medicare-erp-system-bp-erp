import { z } from "zod";
import { ItemCategory } from "@/types/inventory.types";

export const itemSchema = z.object({
  itemCode: z.string().min(1, "Item code is required"),
  itemName: z.string().min(1, "Item name is required"),
  category: z.nativeEnum(ItemCategory, { error: "Category is required" }),
  unit: z.string().optional(),
  quantityInStock: z.coerce.number().int().min(0).optional(),
  reorderLevel: z.coerce.number().int().optional(),
  purchasePrice: z.coerce.number().positive("Purchase price must be positive"),
  sellingPrice: z.coerce.number().optional(),
  storageLocation: z.string().optional(),
  supplierId: z.string().optional(),
});

export type ItemFormValues = z.infer<typeof itemSchema>;

export const supplierSchema = z.object({
  supplierName: z.string().min(1, "Supplier name is required"),
  contactPerson: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Invalid email format").optional().or(z.literal("")),
  address: z.string().optional(),
});

export type SupplierFormValues = z.infer<typeof supplierSchema>;

const purchaseOrderItemSchema = z.object({
  itemId: z.string().min(1, "Item is required"),
  quantity: z.coerce.number().int().positive("Quantity must be positive"),
  unitPrice: z.coerce.number().positive("Unit price must be positive"),
});

export const purchaseOrderSchema = z.object({
  supplierId: z.string().min(1, "Supplier is required"),
  orderDate: z.string().optional(),
  expectedDeliveryDate: z.string().optional(),
  items: z.array(purchaseOrderItemSchema).min(1, "At least one item is required"),
});

export type PurchaseOrderFormValues = z.infer<typeof purchaseOrderSchema>;
