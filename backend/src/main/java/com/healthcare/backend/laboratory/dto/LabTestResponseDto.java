package com.healthcare.backend.laboratory.dto;

import com.healthcare.backend.laboratory.enums.LabTestCategory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LabTestResponseDto {

    private UUID id;
    private String testCode;
    private String testName;
    private LabTestCategory category;
    private String description;
    private BigDecimal price;
    private String sampleType;
    private String normalRange;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
