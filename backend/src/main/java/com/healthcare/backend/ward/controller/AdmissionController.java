package com.healthcare.backend.ward.controller;

import com.healthcare.backend.common.dto.ApiResponse;
import com.healthcare.backend.ward.dto.AdmissionRequestDto;
import com.healthcare.backend.ward.dto.AdmissionResponseDto;
import com.healthcare.backend.ward.service.AdmissionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admissions")
@RequiredArgsConstructor
public class AdmissionController {

    private final AdmissionService admissionService;

    @PostMapping
    public ResponseEntity<ApiResponse<AdmissionResponseDto>> admitPatient(
            @Valid @RequestBody AdmissionRequestDto requestDto) {
        AdmissionResponseDto created = admissionService.admitPatient(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Patient admitted successfully", created));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AdmissionResponseDto>> getAdmissionById(@PathVariable UUID id) {
        AdmissionResponseDto admission = admissionService.getAdmissionById(id);
        return ResponseEntity.ok(ApiResponse.success("Admission retrieved successfully", admission));
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<ApiResponse<List<AdmissionResponseDto>>> getAdmissionsByPatient(
            @PathVariable UUID patientId) {
        List<AdmissionResponseDto> admissions = admissionService.getAdmissionsByPatient(patientId);
        return ResponseEntity.ok(ApiResponse.success("Admissions retrieved successfully", admissions));
    }

    @GetMapping("/current")
    public ResponseEntity<ApiResponse<List<AdmissionResponseDto>>> getCurrentAdmissions() {
        List<AdmissionResponseDto> admissions = admissionService.getCurrentAdmissions();
        return ResponseEntity.ok(ApiResponse.success("Current admissions retrieved successfully", admissions));
    }

    @PatchMapping("/{id}/discharge")
    public ResponseEntity<ApiResponse<AdmissionResponseDto>> dischargePatient(@PathVariable UUID id) {
        AdmissionResponseDto discharged = admissionService.dischargePatient(id);
        return ResponseEntity.ok(ApiResponse.success("Patient discharged successfully", discharged));
    }
}
