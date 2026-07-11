package com.healthcare.backend.laboratory.controller;

import com.healthcare.backend.common.dto.ApiResponse;
import com.healthcare.backend.common.dto.PageResponse;
import com.healthcare.backend.laboratory.dto.LabTestRequestDto;
import com.healthcare.backend.laboratory.dto.LabTestResponseDto;
import com.healthcare.backend.laboratory.service.LabTestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/lab-tests")
@RequiredArgsConstructor
public class LabTestController {

    private final LabTestService labTestService;

    @PostMapping
    public ResponseEntity<ApiResponse<LabTestResponseDto>> createLabTest(
            @Valid @RequestBody LabTestRequestDto requestDto) {
        LabTestResponseDto created = labTestService.createLabTest(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Lab test created successfully", created));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<LabTestResponseDto>> getLabTestById(@PathVariable UUID id) {
        LabTestResponseDto labTest = labTestService.getLabTestById(id);
        return ResponseEntity.ok(ApiResponse.success("Lab test retrieved successfully", labTest));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<LabTestResponseDto>>> getAllLabTests(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "ASC") String sortDirection) {

        Page<LabTestResponseDto> result = labTestService.getAllLabTests(page, size, sortBy, sortDirection);
        return ResponseEntity.ok(ApiResponse.success("Lab tests retrieved successfully", PageResponse.of(result)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<LabTestResponseDto>> updateLabTest(
            @PathVariable UUID id, @Valid @RequestBody LabTestRequestDto requestDto) {
        LabTestResponseDto updated = labTestService.updateLabTest(id, requestDto);
        return ResponseEntity.ok(ApiResponse.success("Lab test updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteLabTest(@PathVariable UUID id) {
        labTestService.deleteLabTest(id);
        return ResponseEntity.ok(ApiResponse.success("Lab test deleted successfully", null));
    }
}
