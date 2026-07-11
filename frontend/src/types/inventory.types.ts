export enum ItemCategory {
  MEDICAL_SUPPLY = "MEDICAL_SUPPLY",
  SURGICAL_EQUIPMENT = "SURGICAL_EQUIPMENT",
  CONSUMABLE = "CONSUMABLE",
  OFFICE_SUPPLY = "OFFICE_SUPPLY",
  PROTECTIVE_EQUIPMENT = "PROTECTIVE_EQUIPMENT",
  CLEANING_SUPPLY = "CLEANING_SUPPLY",
  FURNITURE = "FURNITURE",
  ELECTRONIC_EQUIPMENT = "ELECTRONIC_EQUIPMENT",
  OTHER = "OTHER",
}

export interface ItemRequest {
  itemCode: string;
  itemName: string;
  category: ItemCategory;
  unit?: string;
  quantityInStock?: number;
  reorderLevel?: number;
  purchasePrice: number;
  sellingPrice?: number;
  storageLocation?: string;
  supplierId?: string;
}

export interface Item {
  id: string;
  itemCode: string;
  itemName: string;
  category: ItemCategory;
  unit?: string;
  quantityInStock?: number;
  reorderLevel?: number;
  purchasePrice: number;
  sellingPrice?: number;
  storageLocation?: string;
  belowReorderLevel: boolean;
  supplierId?: string;
  supplierName?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface SupplierRequest {
  supplierName: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  address?: string;
}

export interface Supplier {
  id: string;
  supplierName: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  address?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface PurchaseOrderItemDto {
  id?: string;
  itemId: string;
  itemName?: string;
  quantity: number;
  unitPrice: number;
  totalPrice?: number;
}

export interface PurchaseOrderRequest {
  supplierId: string;
  orderDate?: string;
  expectedDeliveryDate?: string;
  items: { itemId: string; quantity: number; unitPrice: number }[];
}

export interface PurchaseOrder {
  id: string;
  purchaseOrderNumber: string;
  orderDate: string;
  expectedDeliveryDate?: string;
  status: string;
  totalAmount: number;
  supplierId: string;
  supplierName: string;
  items: PurchaseOrderItemDto[];
  createdAt: string;
  updatedAt?: string;
}
