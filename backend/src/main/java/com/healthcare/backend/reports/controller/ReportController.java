package com.healthcare.backend.reports.controller;

import com.healthcare.backend.common.dto.ApiResponse;
import com.healthcare.backend.reports.dto.ReportRequestDto;
import com.healthcare.backend.reports.dto.ReportResponseDto;
import com.healthcare.backend.reports.enums.ReportType;
import com.healthcare.backend.reports.service.ReportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @PostMapping
    public ResponseEntity<ApiResponse<ReportResponseDto>> saveReport(
            @Valid @RequestBody ReportRequestDto requestDto) {
        ReportResponseDto created = reportService.saveReport(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Report saved successfully", created));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ReportResponseDto>> getReportById(@PathVariable UUID id) {
        ReportResponseDto report = reportService.getReportById(id);
        return ResponseEntity.ok(ApiResponse.success("Report retrieved successfully", report));
    }

    @GetMapping("/type/{reportType}")
    public ResponseEntity<ApiResponse<List<ReportResponseDto>>> getReportsByType(
            @PathVariable ReportType reportType) {
        List<ReportResponseDto> reports = reportService.getReportsByType(reportType);
        return ResponseEntity.ok(ApiResponse.success("Reports retrieved successfully", reports));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ReportResponseDto>>> getAllReports() {
        List<ReportResponseDto> reports = reportService.getAllReports();
        return ResponseEntity.ok(ApiResponse.success("Reports retrieved successfully", reports));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteReport(@PathVariable UUID id) {
        reportService.deleteReport(id);
        return ResponseEntity.ok(ApiResponse.success("Report deleted successfully", null));
    }
}
