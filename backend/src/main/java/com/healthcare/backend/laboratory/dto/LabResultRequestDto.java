package com.healthcare.backend.laboratory.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class LabResultRequestDto {

    @NotNull(message = "Lab order item is required")
    private UUID labOrderItemId;

    @NotBlank(message = "Result value is required")
    private String resultValue;

    private String remarks;

    @NotNull(message = "Verifying staff member is required")
    private UUID verifiedById;
}
