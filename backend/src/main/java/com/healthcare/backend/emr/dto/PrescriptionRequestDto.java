package com.healthcare.backend.emr.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class PrescriptionRequestDto {

    private String notes;

    @Valid
    private List<PrescriptionItemDto> items;

    @Getter
    @Setter
    public static class PrescriptionItemDto {

        @NotBlank(message = "Medicine name is required")
        private String medicineName;

        @NotBlank(message = "Dosage is required")
        private String dosage;

        @NotBlank(message = "Frequency is required")
        private String frequency;

        @NotNull(message = "Duration is required")
        private Integer duration;
    }
}