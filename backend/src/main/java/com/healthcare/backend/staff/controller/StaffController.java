package com.healthcare.backend.staff.controller;

import com.healthcare.backend.common.dto.ApiResponse;
import com.healthcare.backend.common.dto.PageResponse;
import com.healthcare.backend.staff.dto.StaffRequestDto;
import com.healthcare.backend.staff.dto.StaffResponseDto;
import com.healthcare.backend.staff.service.StaffService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/staff")
@RequiredArgsConstructor
public class StaffController {

    private final StaffService staffService;

    @PostMapping
    public ResponseEntity<ApiResponse<StaffResponseDto>> createStaff(
            @Valid @RequestBody StaffRequestDto requestDto) {
        StaffResponseDto created = staffService.createStaff(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Staff member created successfully", created));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<StaffResponseDto>> getStaffById(@PathVariable UUID id) {
        StaffResponseDto staff = staffService.getStaffById(id);
        return ResponseEntity.ok(ApiResponse.success("Staff member retrieved successfully", staff));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<StaffResponseDto>>> getAllStaff(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "ASC") String sortDirection) {

        Page<StaffResponseDto> result = staffService.getAllStaff(page, size, sortBy, sortDirection);
        return ResponseEntity.ok(ApiResponse.success("Staff retrieved successfully", PageResponse.of(result)));
    }

    @GetMapping("/department/{departmentId}")
    public ResponseEntity<ApiResponse<List<StaffResponseDto>>> getStaffByDepartment(
            @PathVariable UUID departmentId) {
        List<StaffResponseDto> staff = staffService.getStaffByDepartment(departmentId);
        return ResponseEntity.ok(ApiResponse.success("Staff retrieved successfully", staff));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<StaffResponseDto>> updateStaff(
            @PathVariable UUID id, @Valid @RequestBody StaffRequestDto requestDto) {
        StaffResponseDto updated = staffService.updateStaff(id, requestDto);
        return ResponseEntity.ok(ApiResponse.success("Staff member updated successfully", updated));
    }

    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<ApiResponse<Void>> deactivateStaff(@PathVariable UUID id) {
        staffService.deactivateStaff(id);
        return ResponseEntity.ok(ApiResponse.success("Staff member deactivated successfully", null));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteStaff(@PathVariable UUID id) {
        staffService.deleteStaff(id);
        return ResponseEntity.ok(ApiResponse.success("Staff member deleted successfully", null));
    }
}