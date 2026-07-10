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

}