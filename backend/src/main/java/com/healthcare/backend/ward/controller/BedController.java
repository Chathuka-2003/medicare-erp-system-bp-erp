package com.healthcare.backend.ward.controller;

import com.healthcare.backend.common.dto.ApiResponse;
import com.healthcare.backend.ward.dto.BedRequestDto;
import com.healthcare.backend.ward.dto.BedResponseDto;
import com.healthcare.backend.ward.enums.BedStatus;
import com.healthcare.backend.ward.service.BedService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/beds")
@RequiredArgsConstructor
public class BedController {

    private final BedService bedService;

    @PostMapping
    public ResponseEntity<ApiResponse<BedResponseDto>> createBed(
            @Valid @RequestBody BedRequestDto requestDto) {
        BedResponseDto created = bedService.createBed(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Bed created successfully", created));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BedResponseDto>> getBedById(@PathVariable UUID id) {
        BedResponseDto bed = bedService.getBedById(id);
        return ResponseEntity.ok(ApiResponse.success("Bed retrieved successfully", bed));
    }

    @GetMapping("/ward/{wardId}")
    public ResponseEntity<ApiResponse<List<BedResponseDto>>> getBedsByWard(@PathVariable UUID wardId) {
        List<BedResponseDto> beds = bedService.getBedsByWard(wardId);
        return ResponseEntity.ok(ApiResponse.success("Beds retrieved successfully", beds));
    }

    @GetMapping("/ward/{wardId}/available")
    public ResponseEntity<ApiResponse<List<BedResponseDto>>> getAvailableBeds(@PathVariable UUID wardId) {
        List<BedResponseDto> beds = bedService.getAvailableBeds(wardId);
        return ResponseEntity.ok(ApiResponse.success("Available beds retrieved successfully", beds));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<BedResponseDto>> updateBedStatus(
            @PathVariable UUID id, @RequestParam BedStatus status) {
        BedResponseDto updated = bedService.updateBedStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Bed status updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteBed(@PathVariable UUID id) {
        bedService.deleteBed(id);
        return ResponseEntity.ok(ApiResponse.success("Bed deleted successfully", null));
    }
}
