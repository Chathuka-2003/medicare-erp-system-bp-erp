package com.healthcare.backend.emr.controller;

import com.healthcare.backend.common.dto.ApiResponse;
import com.healthcare.backend.emr.dto.AllergyRequestDto;
import com.healthcare.backend.emr.dto.AllergyResponseDto;
import com.healthcare.backend.emr.service.AllergyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/allergies")
@RequiredArgsConstructor
public class AllergyController {

    private final AllergyService allergyService;

    @PostMapping("/patient/{patientId}")
    public ResponseEntity<ApiResponse<AllergyResponseDto>> addAllergy(
            @PathVariable UUID patientId,
            @Valid @RequestBody AllergyRequestDto requestDto) {
        AllergyResponseDto created = allergyService.addAllergy(patientId, requestDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Allergy added successfully", created));
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<ApiResponse<List<AllergyResponseDto>>> getAllergiesByPatient(
            @PathVariable UUID patientId) {
        List<AllergyResponseDto> allergies = allergyService.getAllergiesByPatient(patientId);
        return ResponseEntity.ok(ApiResponse.success("Allergies retrieved successfully", allergies));
    }

    @PutMapping("/{allergyId}")
    public ResponseEntity<ApiResponse<AllergyResponseDto>> updateAllergy(
            @PathVariable UUID allergyId,
            @Valid @RequestBody AllergyRequestDto requestDto) {
        AllergyResponseDto updated = allergyService.updateAllergy(allergyId, requestDto);
        return ResponseEntity.ok(ApiResponse.success("Allergy updated successfully", updated));
    }

    @DeleteMapping("/{allergyId}")
    public ResponseEntity<ApiResponse<Void>> deleteAllergy(@PathVariable UUID allergyId) {
        allergyService.deleteAllergy(allergyId);
        return ResponseEntity.ok(ApiResponse.success("Allergy deleted successfully", null));
    }
}
