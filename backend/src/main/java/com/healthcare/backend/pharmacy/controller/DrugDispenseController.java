package com.healthcare.backend.pharmacy.controller;

import com.healthcare.backend.common.dto.ApiResponse;
import com.healthcare.backend.pharmacy.dto.DrugDispenseRequestDto;
import com.healthcare.backend.pharmacy.dto.DrugDispenseResponseDto;
import com.healthcare.backend.pharmacy.service.DrugDispenseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/drug-dispenses")
@RequiredArgsConstructor
public class DrugDispenseController {

    private final DrugDispenseService drugDispenseService;

    @PostMapping
    public ResponseEntity<ApiResponse<DrugDispenseResponseDto>> createDispense(
            @Valid @RequestBody DrugDispenseRequestDto requestDto) {
        DrugDispenseResponseDto created = drugDispenseService.createDispense(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Drugs dispensed successfully", created));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DrugDispenseResponseDto>> getDispenseById(@PathVariable UUID id) {
        DrugDispenseResponseDto dispense = drugDispenseService.getDispenseById(id);
        return ResponseEntity.ok(ApiResponse.success("Dispense record retrieved successfully", dispense));
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<ApiResponse<List<DrugDispenseResponseDto>>> getDispensesByPatient(
            @PathVariable UUID patientId) {
        List<DrugDispenseResponseDto> dispenses = drugDispenseService.getDispensesByPatient(patientId);
        return ResponseEntity.ok(ApiResponse.success("Dispense records retrieved successfully", dispenses));
    }
}
