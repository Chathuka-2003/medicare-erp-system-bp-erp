package com.healthcare.backend.inventory.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseOrderResponseDto {

    private UUID id;
    private String purchaseOrderNumber;
    private LocalDate orderDate;
    private LocalDate expectedDeliveryDate;
    private String status;
    private BigDecimal totalAmount;

    private UUID supplierId;
    private String supplierName;

    private List<PurchaseOrderItemDto> items;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PurchaseOrderItemDto {
        private UUID id;
        private UUID itemId;
        private String itemName;
        private Integer quantity;
        private BigDecimal unitPrice;
        private BigDecimal totalPrice;
    }
}
