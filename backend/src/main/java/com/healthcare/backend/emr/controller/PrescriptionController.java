package com.healthcare.backend.emr.controller;

import com.healthcare.backend.common.dto.ApiResponse;
import com.healthcare.backend.emr.dto.PrescriptionRequestDto;
import com.healthcare.backend.emr.dto.PrescriptionResponseDto;
import com.healthcare.backend.emr.service.PrescriptionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/prescriptions")
@RequiredArgsConstructor

public class PrescriptionController {
private final PrescriptionService prescriptionService;

    @PostMapping("/medical-record/{medicalRecordId}")
    public ResponseEntity<ApiResponse<PrescriptionResponseDto>> createPrescription(
            @PathVariable UUID medicalRecordId, @Valid @RequestBody PrescriptionRequestDto requestDto) {
        PrescriptionResponseDto created = prescriptionService.createPrescription(medicalRecordId, requestDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Prescription created successfully", created));
    }

    @GetMapping("/medical-record/{medicalRecordId}")
    public ResponseEntity<ApiResponse<PrescriptionResponseDto>> getPrescriptionByMedicalRecord(
            @PathVariable UUID medicalRecordId) {
        PrescriptionResponseDto prescription = prescriptionService.getPrescriptionByMedicalRecord(medicalRecordId);
        return ResponseEntity.ok(ApiResponse.success("Prescription retrieved successfully", prescription));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PrescriptionResponseDto>> updatePrescription(
            @PathVariable UUID id, @Valid @RequestBody PrescriptionRequestDto requestDto) {
        PrescriptionResponseDto updated = prescriptionService.updatePrescription(id, requestDto);
        return ResponseEntity.ok(ApiResponse.success("Prescription updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deletePrescription(@PathVariable UUID id) {
        prescriptionService.deletePrescription(id);
        return ResponseEntity.ok(ApiResponse.success("Prescription deleted successfully", null));
    }
}