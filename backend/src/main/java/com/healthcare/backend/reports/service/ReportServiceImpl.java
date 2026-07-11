package com.healthcare.backend.reports.service;

import com.healthcare.backend.common.exception.ResourceNotFoundException;
import com.healthcare.backend.reports.dto.ReportRequestDto;
import com.healthcare.backend.reports.dto.ReportResponseDto;
import com.healthcare.backend.reports.entity.SavedReport;
import com.healthcare.backend.reports.enums.ReportType;
import com.healthcare.backend.reports.repository.ReportRepository;
import com.healthcare.backend.staff.entity.Staff;
import com.healthcare.backend.staff.repository.StaffRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ReportServiceImpl implements ReportService {

    private final ReportRepository reportRepository;
    private final StaffRepository staffRepository;

    @Override
    public ReportResponseDto saveReport(ReportRequestDto requestDto) {
        Staff staff = staffRepository.findById(requestDto.getGeneratedById())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Staff member not found with id: " + requestDto.getGeneratedById()));

        SavedReport report = new SavedReport();
        report.setReportName(requestDto.getReportName());
        report.setReportType(requestDto.getReportType());
        report.setReportParameters(requestDto.getReportParameters());
        report.setDescription(requestDto.getDescription());
        report.setGeneratedAt(LocalDateTime.now());
        report.setGeneratedBy(staff);

        // File generation (PDF/Excel export) is not implemented here.
        // fileName/filePath/fileFormat can be populated once an export mechanism is added.

        SavedReport saved = reportRepository.save(report);
        return toResponseDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public ReportResponseDto getReportById(UUID id) {
        return toResponseDto(findReportOrThrow(id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReportResponseDto> getReportsByType(ReportType reportType) {
        return reportRepository.findByReportType(reportType).stream()
                .map(this::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReportResponseDto> getAllReports() {
        return reportRepository.findAll().stream()
                .map(this::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteReport(UUID id) {
        SavedReport report = findReportOrThrow(id);
        reportRepository.delete(report);
    }

    private ReportResponseDto toResponseDto(SavedReport report) {
        ReportResponseDto.ReportResponseDtoBuilder builder = ReportResponseDto.builder()
                .id(report.getId())
                .reportName(report.getReportName())
                .reportType(report.getReportType())
                .reportParameters(report.getReportParameters())
                .description(report.getDescription())
                .fileName(report.getFileName())
                .filePath(report.getFilePath())
                .fileFormat(report.getFileFormat())
                .generatedAt(report.getGeneratedAt())
                .createdAt(report.getCreatedAt())
                .updatedAt(report.getUpdatedAt());

        if (report.getGeneratedBy() != null) {
            builder.generatedById(report.getGeneratedBy().getId());
            builder.generatedByName((report.getGeneratedBy().getFirstName() + " " +
                    (report.getGeneratedBy().getLastName() != null ? report.getGeneratedBy().getLastName() : "")).trim());
        }

        return builder.build();
    }

    private SavedReport findReportOrThrow(UUID id) {
        return reportRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found with id: " + id));
    }
}
