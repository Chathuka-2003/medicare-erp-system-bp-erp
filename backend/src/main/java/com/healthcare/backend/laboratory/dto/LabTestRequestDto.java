package com.healthcare.backend.laboratory.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class LabTestRequestDto {

    @NotBlank(message = "Test code is required")
    private String testCode;

    @NotBlank(message = "Test name is required")
    private String testName;

    private String category;

    private String description;

    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    private BigDecimal price;

    private String sampleType;

    private String normalRange;
}
