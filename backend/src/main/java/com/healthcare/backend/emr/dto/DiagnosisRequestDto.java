package com.healthcare.backend.emr.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;
@Getter
@Setter
public class DiagnosisRequestDto {

    @NotNull(message = "Medical record is required")
    private UUID medicalRecordId;

    @NotBlank(message = "Diagnosis name is required")
    private String diagnosisName;

    private String description;

    private String severity;
}