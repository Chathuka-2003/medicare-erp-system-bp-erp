package com.healthcare.backend.patient.controller;

import com.healthcare.backend.common.dto.ApiResponse;
import com.healthcare.backend.common.dto.PageResponse;
import com.healthcare.backend.patient.dto.PatientResponseDto;
import com.healthcare.backend.patient.dto.PatientSearchDto;
import com.healthcare.backend.patient.service.PatientService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/patients/search")
@RequiredArgsConstructor
public class PatientSearchController {

    private final PatientService patientService;

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<PatientResponseDto>>> searchPatients(
            @ModelAttribute PatientSearchDto searchDto) {
        Page<PatientResponseDto> result = patientService.searchPatients(searchDto);
        return ResponseEntity.ok(ApiResponse.success("Search completed successfully", PageResponse.of(result)));
    }
}