package com.healthcare.backend.emr.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AllergyResponseDto {

    private UUID id;
    private String allergyName;
    private String description;
    private String severity;
    private UUID patientId;
    private LocalDateTime createdAt;
}
