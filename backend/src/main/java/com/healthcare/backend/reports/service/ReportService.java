package com.healthcare.backend.reports.service;

import com.healthcare.backend.reports.dto.ReportRequestDto;
import com.healthcare.backend.reports.dto.ReportResponseDto;
import com.healthcare.backend.reports.enums.ReportType;

import java.util.List;
import java.util.UUID;

public interface ReportService {

    ReportResponseDto saveReport(ReportRequestDto requestDto);

    ReportResponseDto getReportById(UUID id);

    List<ReportResponseDto> getReportsByType(ReportType reportType);

    List<ReportResponseDto> getAllReports();

    void deleteReport(UUID id);
}
