package com.healthcare.backend.inventory.service;

import com.healthcare.backend.inventory.dto.PurchaseOrderRequestDto;
import com.healthcare.backend.inventory.dto.PurchaseOrderResponseDto;

import java.util.List;
import java.util.UUID;

public interface PurchaseOrderService {

    PurchaseOrderResponseDto createPurchaseOrder(PurchaseOrderRequestDto requestDto);

    PurchaseOrderResponseDto getPurchaseOrderById(UUID id);

    List<PurchaseOrderResponseDto> getPurchaseOrdersBySupplier(UUID supplierId);

    PurchaseOrderResponseDto receivePurchaseOrder(UUID id);

    void cancelPurchaseOrder(UUID id);
}
