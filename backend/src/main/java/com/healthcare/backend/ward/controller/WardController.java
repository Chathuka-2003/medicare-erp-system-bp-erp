package com.healthcare.backend.ward.controller;

import com.healthcare.backend.common.dto.ApiResponse;
import com.healthcare.backend.ward.dto.WardRequestDto;
import com.healthcare.backend.ward.dto.WardResponseDto;
import com.healthcare.backend.ward.service.WardService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/wards")
@RequiredArgsConstructor
public class WardController {

    private final WardService wardService;

    @PostMapping
    public ResponseEntity<ApiResponse<WardResponseDto>> createWard(
            @Valid @RequestBody WardRequestDto requestDto) {
        WardResponseDto created = wardService.createWard(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Ward created successfully", created));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<WardResponseDto>> getWardById(@PathVariable UUID id) {
        WardResponseDto ward = wardService.getWardById(id);
        return ResponseEntity.ok(ApiResponse.success("Ward retrieved successfully", ward));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<WardResponseDto>>> getAllWards() {
        List<WardResponseDto> wards = wardService.getAllWards();
        return ResponseEntity.ok(ApiResponse.success("Wards retrieved successfully", wards));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<WardResponseDto>> updateWard(
            @PathVariable UUID id, @Valid @RequestBody WardRequestDto requestDto) {
        WardResponseDto updated = wardService.updateWard(id, requestDto);
        return ResponseEntity.ok(ApiResponse.success("Ward updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteWard(@PathVariable UUID id) {
        wardService.deleteWard(id);
        return ResponseEntity.ok(ApiResponse.success("Ward deleted successfully", null));
    }
}
