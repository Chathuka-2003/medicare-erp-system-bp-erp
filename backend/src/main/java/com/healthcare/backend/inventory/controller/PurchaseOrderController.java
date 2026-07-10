package com.healthcare.backend.inventory.controller;

import com.healthcare.backend.common.dto.ApiResponse;
import com.healthcare.backend.inventory.dto.PurchaseOrderRequestDto;
import com.healthcare.backend.inventory.dto.PurchaseOrderResponseDto;
import com.healthcare.backend.inventory.service.PurchaseOrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/purchase-orders")
@RequiredArgsConstructor
public class PurchaseOrderController {

    private final PurchaseOrderService purchaseOrderService;

    @PostMapping
    public ResponseEntity<ApiResponse<PurchaseOrderResponseDto>> createPurchaseOrder(
            @Valid @RequestBody PurchaseOrderRequestDto requestDto) {
        PurchaseOrderResponseDto created = purchaseOrderService.createPurchaseOrder(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Purchase order created successfully", created));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PurchaseOrderResponseDto>> getPurchaseOrderById(@PathVariable UUID id) {
        PurchaseOrderResponseDto po = purchaseOrderService.getPurchaseOrderById(id);
        return ResponseEntity.ok(ApiResponse.success("Purchase order retrieved successfully", po));
    }

    @GetMapping("/supplier/{supplierId}")
    public ResponseEntity<ApiResponse<List<PurchaseOrderResponseDto>>> getPurchaseOrdersBySupplier(
            @PathVariable UUID supplierId) {
        List<PurchaseOrderResponseDto> orders = purchaseOrderService.getPurchaseOrdersBySupplier(supplierId);
        return ResponseEntity.ok(ApiResponse.success("Purchase orders retrieved successfully", orders));
    }

    @PatchMapping("/{id}/receive")
    public ResponseEntity<ApiResponse<PurchaseOrderResponseDto>> receivePurchaseOrder(@PathVariable UUID id) {
        PurchaseOrderResponseDto received = purchaseOrderService.receivePurchaseOrder(id);
        return ResponseEntity.ok(ApiResponse.success("Purchase order received and stock updated successfully", received));
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<Void>> cancelPurchaseOrder(@PathVariable UUID id) {
        purchaseOrderService.cancelPurchaseOrder(id);
        return ResponseEntity.ok(ApiResponse.success("Purchase order cancelled successfully", null));
    }
}
