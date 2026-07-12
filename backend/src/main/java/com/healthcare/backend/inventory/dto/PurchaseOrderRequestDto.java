package com.healthcare.backend.inventory.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
public class PurchaseOrderRequestDto {

    @NotNull(message = "Supplier is required")
    private UUID supplierId;

    private LocalDate orderDate;

    private LocalDate expectedDeliveryDate;

    @NotEmpty(message = "At least one item is required")
    @Valid
    private List<PurchaseOrderItemDto> items;

    @Getter
    @Setter
    public static class PurchaseOrderItemDto {

        @NotNull(message = "Item is required")
        private UUID itemId;

        @NotNull(message = "Quantity is required")
        private Integer quantity;

        @NotNull(message = "Unit price is required")
        private BigDecimal unitPrice;
    }
}
