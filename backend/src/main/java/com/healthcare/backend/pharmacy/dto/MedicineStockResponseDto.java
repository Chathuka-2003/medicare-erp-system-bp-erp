package com.healthcare.backend.pharmacy.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MedicineStockResponseDto {

    private UUID id;
    private String batchNumber;
    private Integer quantityInStock;
    private Integer reorderLevel;
    private LocalDate manufactureDate;
    private LocalDate expiryDate;
    private String storageLocation;
}