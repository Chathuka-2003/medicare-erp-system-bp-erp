package com.healthcare.backend.ward.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class AdmissionRequestDto {

    @NotNull(message = "Patient is required")
    private UUID patientId;

    @NotNull(message = "Doctor is required")
    private UUID doctorId;

    @NotNull(message = "Bed is required")
    private UUID bedId;

    private String diagnosis;

    private String remarks;
}
