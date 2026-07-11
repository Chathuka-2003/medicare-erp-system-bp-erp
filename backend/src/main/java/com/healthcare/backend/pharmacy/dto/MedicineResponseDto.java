package com.healthcare.backend.pharmacy.dto;

import com.healthcare.backend.pharmacy.enums.MedicineCategory;
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
public class MedicineResponseDto {

    private UUID id;
    private String medicineCode;
    private String medicineName;
    private String genericName;
    private String manufacturer;
    private MedicineCategory category;
    private String dosageForm;
    private String strength;
    private BigDecimal unitPrice;
    private Integer totalStock;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}