package com.healthcare.backend.patient.controller;

import com.healthcare.backend.common.dto.ApiResponse;
import com.healthcare.backend.common.dto.PageResponse;
import com.healthcare.backend.patient.dto.PatientRequestDto;
import com.healthcare.backend.patient.dto.PatientResponseDto;
import com.healthcare.backend.patient.service.PatientService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/patients")
@RequiredArgsConstructor
public class PatientController {

    private final PatientService patientService;

    @PostMapping
    public ResponseEntity<ApiResponse<PatientResponseDto>> createPatient(
            @Valid @RequestBody PatientRequestDto requestDto) {
        PatientResponseDto created = patientService.createPatient(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Patient created successfully", created));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PatientResponseDto>> getPatientById(@PathVariable UUID id) {
        PatientResponseDto patient = patientService.getPatientById(id);
        return ResponseEntity.ok(ApiResponse.success("Patient retrieved successfully", patient));
    }

    @GetMapping("/number/{patientNumber}")
    public ResponseEntity<ApiResponse<PatientResponseDto>> getPatientByPatientNumber(
            @PathVariable String patientNumber) {
        PatientResponseDto patient = patientService.getPatientByPatientNumber(patientNumber);
        return ResponseEntity.ok(ApiResponse.success("Patient retrieved successfully", patient));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<PatientResponseDto>>> getAllPatients(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "ASC") String sortDirection) {

        Page<PatientResponseDto> result = patientService.getAllPatients(page, size, sortBy, sortDirection);
        return ResponseEntity.ok(ApiResponse.success("Patients retrieved successfully", PageResponse.of(result)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PatientResponseDto>> updatePatient(
            @PathVariable UUID id, @Valid @RequestBody PatientRequestDto requestDto) {
        PatientResponseDto updated = patientService.updatePatient(id, requestDto);
        return ResponseEntity.ok(ApiResponse.success("Patient updated successfully", updated));
    }

}