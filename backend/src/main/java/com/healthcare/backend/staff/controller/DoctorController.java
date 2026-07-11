package com.healthcare.backend.staff.controller;

import com.healthcare.backend.common.dto.ApiResponse;
import com.healthcare.backend.common.dto.PageResponse;
import com.healthcare.backend.staff.dto.DoctorRequestDto;
import com.healthcare.backend.staff.dto.DoctorResponseDto;
import com.healthcare.backend.staff.service.DoctorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/doctors")
@RequiredArgsConstructor
public class DoctorController {

    private final DoctorService doctorService;

    @PostMapping
    public ResponseEntity<ApiResponse<DoctorResponseDto>> createDoctor(
            @Valid @RequestBody DoctorRequestDto requestDto) {
        DoctorResponseDto created = doctorService.createDoctor(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Doctor created successfully", created));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DoctorResponseDto>> getDoctorById(@PathVariable UUID id) {
        DoctorResponseDto doctor = doctorService.getDoctorById(id);
        return ResponseEntity.ok(ApiResponse.success("Doctor retrieved successfully", doctor));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<DoctorResponseDto>>> getAllDoctors(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "ASC") String sortDirection) {

        Page<DoctorResponseDto> result = doctorService.getAllDoctors(page, size, sortBy, sortDirection);
        return ResponseEntity.ok(ApiResponse.success("Doctors retrieved successfully", PageResponse.of(result)));
    }

    @GetMapping("/department/{departmentId}")
    public ResponseEntity<ApiResponse<List<DoctorResponseDto>>> getDoctorsByDepartment(
            @PathVariable UUID departmentId) {
        List<DoctorResponseDto> doctors = doctorService.getDoctorsByDepartment(departmentId);
        return ResponseEntity.ok(ApiResponse.success("Doctors retrieved successfully", doctors));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<DoctorResponseDto>> updateDoctor(
            @PathVariable UUID id, @Valid @RequestBody DoctorRequestDto requestDto) {
        DoctorResponseDto updated = doctorService.updateDoctor(id, requestDto);
        return ResponseEntity.ok(ApiResponse.success("Doctor updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteDoctor(@PathVariable UUID id) {
        doctorService.deleteDoctor(id);
        return ResponseEntity.ok(ApiResponse.success("Doctor deleted successfully", null));
    }
}