package com.healthcare.backend.billing.controller;

import com.healthcare.backend.billing.dto.InsuranceClaimRequestDto;
import com.healthcare.backend.billing.dto.InsuranceClaimResponseDto;
import com.healthcare.backend.billing.service.InsuranceClaimService;
import com.healthcare.backend.common.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
//import java.util.UUID;


@RestController
@RequestMapping("/api/v1/insurance-claims")
@RequiredArgsConstructor
public class InsuranceClaimController {

 private final InsuranceClaimService insuranceClaimService;

    @PostMapping
    public ResponseEntity<ApiResponse<InsuranceClaimResponseDto>> createClaim(
            @Valid @RequestBody InsuranceClaimRequestDto requestDto) {
        InsuranceClaimResponseDto created = insuranceClaimService.createClaim(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Insurance claim created successfully", created));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<InsuranceClaimResponseDto>> getClaimById(@PathVariable UUID id) {
        InsuranceClaimResponseDto claim = insuranceClaimService.getClaimById(id);
        return ResponseEntity.ok(ApiResponse.success("Insurance claim retrieved successfully", claim));
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<ApiResponse<List<InsuranceClaimResponseDto>>> getClaimsByPatient(
            @PathVariable UUID patientId) {
        List<InsuranceClaimResponseDto> claims = insuranceClaimService.getClaimsByPatient(patientId);
        return ResponseEntity.ok(ApiResponse.success("Insurance claims retrieved successfully", claims));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<InsuranceClaimResponseDto>> updateClaim(
            @PathVariable UUID id, @Valid @RequestBody InsuranceClaimRequestDto requestDto) {
        InsuranceClaimResponseDto updated = insuranceClaimService.updateClaim(id, requestDto);
        return ResponseEntity.ok(ApiResponse.success("Insurance claim updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteClaim(@PathVariable UUID id) {
        insuranceClaimService.deleteClaim(id);
        return ResponseEntity.ok(ApiResponse.success("Insurance claim deleted successfully", null));
    }
}