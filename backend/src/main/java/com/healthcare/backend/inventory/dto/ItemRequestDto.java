package com.healthcare.backend.inventory.dto;

import com.healthcare.backend.inventory.enums.ItemCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
public class ItemRequestDto {

    @NotBlank(message = "Item code is required")
    private String itemCode;

    @NotBlank(message = "Item name is required")
    private String itemName;

    @NotNull(message = "Category is required")
    private ItemCategory category;

    private String unit;

    @PositiveOrZero(message = "Quantity in stock cannot be negative")
    private Integer quantityInStock;

    private Integer reorderLevel;

    @NotNull(message = "Purchase price is required")
    private BigDecimal purchasePrice;

    private BigDecimal sellingPrice;

    private String storageLocation;

    private UUID supplierId;
}
