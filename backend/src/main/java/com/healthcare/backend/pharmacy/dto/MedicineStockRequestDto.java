package com.healthcare.backend.pharmacy.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class MedicineStockRequestDto {

    
    @NotBlank(message = "Batch number is required")
    private String batchNumber;

    @NotNull(message = "Quantity is required")
    @Positive(message = "Quantity must be positive")
    private Integer quantityInStock;

    private Integer reorderLevel;

    private LocalDate manufactureDate;

    @NotNull(message = "Expiry date is required")
    private LocalDate expiryDate;

    private String storageLocation;
}