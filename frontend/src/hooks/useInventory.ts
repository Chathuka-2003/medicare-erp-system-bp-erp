"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { itemApi, supplierApi, purchaseOrderApi } from "@/lib/api/inventory.api";
import { ItemRequest, SupplierRequest, PurchaseOrderRequest } from "@/types/inventory.types";

const ITEMS_KEY = "items";
const SUPPLIERS_KEY = "suppliers";
const PO_KEY = "purchase-orders";

export function useItems(params: { page?: number; size?: number; sortBy?: string; sortDirection?: "ASC" | "DESC" }) {
  return useQuery({
    queryKey: [ITEMS_KEY, "all", params],
    queryFn: () => itemApi.getAll(params),
  });
}

export function useItem(id: string | undefined) {
  return useQuery({
    queryKey: [ITEMS_KEY, id],
    queryFn: () => itemApi.getById(id as string),
    enabled: !!id,
  });
}

export function useLowStockItems() {
  return useQuery({ queryKey: [ITEMS_KEY, "low-stock"], queryFn: () => itemApi.getLowStock() });
}

export function useCreateItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ItemRequest) => itemApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ITEMS_KEY] });
      toast.success("Item created successfully");
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? "Failed to create item"),
  });
}

export function useUpdateItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ItemRequest }) => itemApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ITEMS_KEY] });
      toast.success("Item updated successfully");
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? "Failed to update item"),
  });
}

export function useDeleteItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => itemApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ITEMS_KEY] });
      toast.success("Item deleted successfully");
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? "Failed to delete item"),
  });
}

export function useSuppliers() {
  return useQuery({ queryKey: [SUPPLIERS_KEY, "all"], queryFn: () => supplierApi.getAll() });
}

export function useCreateSupplier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SupplierRequest) => supplierApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SUPPLIERS_KEY] });
      toast.success("Supplier created successfully");
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? "Failed to create supplier"),
  });
}

export function useDeleteSupplier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => supplierApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SUPPLIERS_KEY] });
      toast.success("Supplier deleted successfully");
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? "Failed to delete supplier"),
  });
}

export function usePurchaseOrdersBySupplier(supplierId: string | undefined) {
  return useQuery({
    queryKey: [PO_KEY, "supplier", supplierId],
    queryFn: () => purchaseOrderApi.getBySupplier(supplierId as string),
    enabled: !!supplierId,
  });
}

export function usePurchaseOrder(id: string | undefined) {
  return useQuery({
    queryKey: [PO_KEY, id],
    queryFn: () => purchaseOrderApi.getById(id as string),
    enabled: !!id,
  });
}

export function useCreatePurchaseOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PurchaseOrderRequest) => purchaseOrderApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PO_KEY] });
      toast.success("Purchase order created successfully");
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? "Failed to create purchase order"),
  });
}

export function useReceivePurchaseOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => purchaseOrderApi.receive(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PO_KEY] });
      queryClient.invalidateQueries({ queryKey: [ITEMS_KEY] });
      toast.success("Purchase order received — stock updated");
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? "Failed to receive purchase order"),
  });
}

export function useCancelPurchaseOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => purchaseOrderApi.cancel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PO_KEY] });
      toast.success("Purchase order cancelled");
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? "Failed to cancel purchase order"),
  });
}
