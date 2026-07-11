package com.healthcare.backend.emr.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DiagnosisResponseDto {
    private UUID id;
    private UUID medicalRecordId;
    private String diagnosisName;
    private String description;
    private String severity;
}