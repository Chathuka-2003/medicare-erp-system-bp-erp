package com.healthcare.backend.laboratory.dto;

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
public class LabResultResponseDto {

    private UUID id;
    private UUID labOrderItemId;
    private String testName;
    private String resultValue;
    private String remarks;
    private LocalDateTime completedDate;

    private UUID verifiedById;
    private String verifiedByName;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
