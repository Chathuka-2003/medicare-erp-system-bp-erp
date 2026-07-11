package com.healthcare.backend.laboratory.controller;

import com.healthcare.backend.common.dto.ApiResponse;
import com.healthcare.backend.laboratory.dto.*;
import com.healthcare.backend.laboratory.service.LabResultService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/lab-results")
@RequiredArgsConstructor
public class LabResultController {

    private final LabResultService labResultService;

    @PostMapping("/orders")
    public ResponseEntity<ApiResponse<LabOrderResponseDto>> createLabOrder(
            @Valid @RequestBody LabOrderRequestDto requestDto) {
        LabOrderResponseDto created = labResultService.createLabOrder(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Lab order created successfully", created));
    }

    @GetMapping("/orders/{id}")
    public ResponseEntity<ApiResponse<LabOrderResponseDto>> getLabOrderById(@PathVariable UUID id) {
        LabOrderResponseDto order = labResultService.getLabOrderById(id);
        return ResponseEntity.ok(ApiResponse.success("Lab order retrieved successfully", order));
    }

    @GetMapping("/orders/patient/{patientId}")
    public ResponseEntity<ApiResponse<List<LabOrderResponseDto>>> getLabOrdersByPatient(
            @PathVariable UUID patientId) {
        List<LabOrderResponseDto> orders = labResultService.getLabOrdersByPatient(patientId);
        return ResponseEntity.ok(ApiResponse.success("Lab orders retrieved successfully", orders));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<LabResultResponseDto>> recordResult(
            @Valid @RequestBody LabResultRequestDto requestDto) {
        LabResultResponseDto result = labResultService.recordResult(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Lab result recorded successfully", result));
    }

    @GetMapping("/order-item/{labOrderItemId}")
    public ResponseEntity<ApiResponse<LabResultResponseDto>> getResultByOrderItem(
            @PathVariable UUID labOrderItemId) {
        LabResultResponseDto result = labResultService.getResultByOrderItem(labOrderItemId);
        return ResponseEntity.ok(ApiResponse.success("Lab result retrieved successfully", result));
    }
}
