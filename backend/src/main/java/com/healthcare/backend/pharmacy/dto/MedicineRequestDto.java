package com.healthcare.backend.pharmacy.dto;

import com.healthcare.backend.pharmacy.enums.MedicineCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class MedicineRequestDto {

    @NotBlank(message = "Medicine code is required")
    private String medicineCode;

    @NotBlank(message = "Medicine name is required")
    private String medicineName;

    private String genericName;

    private String manufacturer;

    @NotNull(message = "Category is required")
    private MedicineCategory category;

    private String dosageForm;

    private String strength;

    @NotNull(message = "Unit price is required")
    @Positive(message = "Unit price must be positive")
    private BigDecimal unitPrice;
}