package com.healthcare.backend.inventory.dto;

import com.healthcare.backend.inventory.enums.ItemCategory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ItemResponseDto {

    private UUID id;
    private String itemCode;
    private String itemName;
    private ItemCategory category;
    private String unit;
    private Integer quantityInStock;
    private Integer reorderLevel;
    private BigDecimal purchasePrice;
    private BigDecimal sellingPrice;
    private String storageLocation;
    private boolean belowReorderLevel;

    private UUID supplierId;
    private String supplierName;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
