import { apiClient } from "./client";
import { ApiResponse, PageResponse } from "@/types/common.types";
import {
  Item, ItemRequest, Supplier, SupplierRequest,
  PurchaseOrder, PurchaseOrderRequest,
} from "@/types/inventory.types";

const ITEM_BASE_PATH = "/items";
const SUPPLIER_BASE_PATH = "/suppliers";
const PO_BASE_PATH = "/purchase-orders";

export const itemApi = {
  create: async (data: ItemRequest): Promise<Item> => {
    const response = await apiClient.post<ApiResponse<Item>>(ITEM_BASE_PATH, data);
    return response.data.data;
  },

  getById: async (id: string): Promise<Item> => {
    const response = await apiClient.get<ApiResponse<Item>>(`${ITEM_BASE_PATH}/${id}`);
    return response.data.data;
  },

  getAll: async (params: {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDirection?: "ASC" | "DESC";
  }): Promise<PageResponse<Item>> => {
    const response = await apiClient.get<ApiResponse<PageResponse<Item>>>(ITEM_BASE_PATH, { params });
    return response.data.data;
  },

  getLowStock: async (): Promise<Item[]> => {
    const response = await apiClient.get<ApiResponse<Item[]>>(`${ITEM_BASE_PATH}/low-stock`);
    return response.data.data;
  },

  update: async (id: string, data: ItemRequest): Promise<Item> => {
    const response = await apiClient.put<ApiResponse<Item>>(`${ITEM_BASE_PATH}/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`${ITEM_BASE_PATH}/${id}`);
  },
};

export const supplierApi = {
  create: async (data: SupplierRequest): Promise<Supplier> => {
    const response = await apiClient.post<ApiResponse<Supplier>>(SUPPLIER_BASE_PATH, data);
    return response.data.data;
  },

  getById: async (id: string): Promise<Supplier> => {
    const response = await apiClient.get<ApiResponse<Supplier>>(`${SUPPLIER_BASE_PATH}/${id}`);
    return response.data.data;
  },

  getAll: async (): Promise<Supplier[]> => {
    const response = await apiClient.get<ApiResponse<Supplier[]>>(SUPPLIER_BASE_PATH);
    return response.data.data;
  },

  update: async (id: string, data: SupplierRequest): Promise<Supplier> => {
    const response = await apiClient.put<ApiResponse<Supplier>>(`${SUPPLIER_BASE_PATH}/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`${SUPPLIER_BASE_PATH}/${id}`);
  },
};

export const purchaseOrderApi = {
  create: async (data: PurchaseOrderRequest): Promise<PurchaseOrder> => {
    const response = await apiClient.post<ApiResponse<PurchaseOrder>>(PO_BASE_PATH, data);
    return response.data.data;
  },

  getById: async (id: string): Promise<PurchaseOrder> => {
    const response = await apiClient.get<ApiResponse<PurchaseOrder>>(`${PO_BASE_PATH}/${id}`);
    return response.data.data;
  },

  getBySupplier: async (supplierId: string): Promise<PurchaseOrder[]> => {
    const response = await apiClient.get<ApiResponse<PurchaseOrder[]>>(`${PO_BASE_PATH}/supplier/${supplierId}`);
    return response.data.data;
  },

  receive: async (id: string): Promise<PurchaseOrder> => {
    const response = await apiClient.patch<ApiResponse<PurchaseOrder>>(`${PO_BASE_PATH}/${id}/receive`);
    return response.data.data;
  },

  cancel: async (id: string): Promise<void> => {
    await apiClient.patch(`${PO_BASE_PATH}/${id}/cancel`);
  },
};
