package com.healthcare.backend.emr.controller;

import com.healthcare.backend.common.dto.ApiResponse;
import com.healthcare.backend.emr.dto.MedicalRecordRequestDto;
import com.healthcare.backend.emr.dto.MedicalRecordResponseDto;
import com.healthcare.backend.emr.service.MedicalRecordService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
@RestController
@RequestMapping("/api/v1/medical-records")
@RequiredArgsConstructor

public class MedicalRecordController {
 private final MedicalRecordService medicalRecordService;

    @PostMapping
    public ResponseEntity<ApiResponse<MedicalRecordResponseDto>> createMedicalRecord(
            @Valid @RequestBody MedicalRecordRequestDto requestDto) {
        MedicalRecordResponseDto created = medicalRecordService.createMedicalRecord(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Medical record created successfully", created));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<MedicalRecordResponseDto>> getMedicalRecordById(@PathVariable UUID id) {
        MedicalRecordResponseDto record = medicalRecordService.getMedicalRecordById(id);
        return ResponseEntity.ok(ApiResponse.success("Medical record retrieved successfully", record));
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<ApiResponse<List<MedicalRecordResponseDto>>> getMedicalRecordsByPatient(
            @PathVariable UUID patientId) {
        List<MedicalRecordResponseDto> records = medicalRecordService.getMedicalRecordsByPatient(patientId);
        return ResponseEntity.ok(ApiResponse.success("Medical records retrieved successfully", records));
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<ApiResponse<List<MedicalRecordResponseDto>>> getMedicalRecordsByDoctor(
            @PathVariable UUID doctorId) {
        List<MedicalRecordResponseDto> records = medicalRecordService.getMedicalRecordsByDoctor(doctorId);
        return ResponseEntity.ok(ApiResponse.success("Medical records retrieved successfully", records));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<MedicalRecordResponseDto>> updateMedicalRecord(
            @PathVariable UUID id, @Valid @RequestBody MedicalRecordRequestDto requestDto) {
        MedicalRecordResponseDto updated = medicalRecordService.updateMedicalRecord(id, requestDto);
        return ResponseEntity.ok(ApiResponse.success("Medical record updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteMedicalRecord(@PathVariable UUID id) {
        medicalRecordService.deleteMedicalRecord(id);
        return ResponseEntity.ok(ApiResponse.success("Medical record deleted successfully", null));
    }
}