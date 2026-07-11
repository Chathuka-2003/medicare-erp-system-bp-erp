package com.healthcare.backend.pharmacy.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
public class DrugDispenseRequestDto {

    @NotNull(message = "Patient is required")
    private UUID patientId;

    private UUID prescriptionId;

    @NotNull(message = "Pharmacist is required")
    private UUID pharmacistId;

    private String remarks;

    @NotEmpty(message = "At least one item is required")
    @Valid
    private List<DrugDispenseItemDto> items;

    @Getter
    @Setter
    public static class DrugDispenseItemDto {

        @NotNull(message = "Medicine is required")
        private UUID medicineId;

        @NotNull(message = "Quantity is required")
        private Integer quantity;

        private String dosage;

        private String instructions;
    }
}