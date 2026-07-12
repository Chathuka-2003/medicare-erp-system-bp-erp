package com.healthcare.backend.ward.dto;

import com.healthcare.backend.ward.enums.WardType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class WardRequestDto {

    @NotBlank(message = "Ward code is required")
    private String wardCode;

    @NotBlank(message = "Ward name is required")
    private String wardName;

    @NotNull(message = "Ward type is required")
    private WardType wardType;

    @NotNull(message = "Total beds is required")
    @Positive(message = "Total beds must be positive")
    private Integer totalBeds;

    private String floor;

    private String description;
}
