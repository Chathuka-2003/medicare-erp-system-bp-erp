package com.healthcare.backend.emr.controller;

import com.healthcare.backend.common.dto.ApiResponse;
import com.healthcare.backend.emr.dto.DiagnosisRequestDto;
import com.healthcare.backend.emr.dto.DiagnosisResponseDto;
import com.healthcare.backend.emr.service.DiagnosisService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;


@RestController
@RequestMapping("/api/v1/diagnoses")
@RequiredArgsConstructor

public class DiagnosisController {
 private final DiagnosisService diagnosisService;

    @PostMapping
    public ResponseEntity<ApiResponse<DiagnosisResponseDto>> addDiagnosis(
            @Valid @RequestBody DiagnosisRequestDto requestDto) {
        DiagnosisResponseDto created = diagnosisService.addDiagnosis(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Diagnosis added successfully", created));
    }

    @GetMapping("/medical-record/{medicalRecordId}")
    public ResponseEntity<ApiResponse<List<DiagnosisResponseDto>>> getDiagnosesByMedicalRecord(
            @PathVariable UUID medicalRecordId) {
        List<DiagnosisResponseDto> diagnoses = diagnosisService.getDiagnosesByMedicalRecord(medicalRecordId);
        return ResponseEntity.ok(ApiResponse.success("Diagnoses retrieved successfully", diagnoses));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<DiagnosisResponseDto>> updateDiagnosis(
            @PathVariable UUID id, @Valid @RequestBody DiagnosisRequestDto requestDto) {
        DiagnosisResponseDto updated = diagnosisService.updateDiagnosis(id, requestDto);
        return ResponseEntity.ok(ApiResponse.success("Diagnosis updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteDiagnosis(@PathVariable UUID id) {
        diagnosisService.deleteDiagnosis(id);
        return ResponseEntity.ok(ApiResponse.success("Diagnosis deleted successfully", null));
    }
}