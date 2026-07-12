package com.healthcare.backend.reports.dto;

import com.healthcare.backend.reports.enums.ReportType;
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
public class ReportResponseDto {

    private UUID id;
    private String reportName;
    private ReportType reportType;
    private String reportParameters;
    private String description;
    private String fileName;
    private String filePath;
    private String fileFormat;
    private LocalDateTime generatedAt;

    private UUID generatedById;
    private String generatedByName;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
