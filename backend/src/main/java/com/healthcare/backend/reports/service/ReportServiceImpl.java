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

public class ReportServiceImpl implements ReportService {


}