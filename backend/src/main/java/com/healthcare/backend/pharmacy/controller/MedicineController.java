package com.healthcare.backend.pharmacy.controller;

import com.healthcare.backend.common.dto.ApiResponse;
import com.healthcare.backend.common.dto.PageResponse;
import com.healthcare.backend.pharmacy.dto.*;
import com.healthcare.backend.pharmacy.service.MedicineService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/medicines")
@RequiredArgsConstructor
public class MedicineController {

    private final MedicineService medicineService;

    @PostMapping
    public ResponseEntity<ApiResponse<MedicineResponseDto>> createMedicine(
            @Valid @RequestBody MedicineRequestDto requestDto) {
        MedicineResponseDto created = medicineService.createMedicine(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Medicine created successfully", created));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<MedicineResponseDto>> getMedicineById(@PathVariable UUID id) {
        MedicineResponseDto medicine = medicineService.getMedicineById(id);
        return ResponseEntity.ok(ApiResponse.success("Medicine retrieved successfully", medicine));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<MedicineResponseDto>>> getAllMedicines(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "ASC") String sortDirection) {

        Page<MedicineResponseDto> result = medicineService.getAllMedicines(page, size, sortBy, sortDirection);
        return ResponseEntity.ok(ApiResponse.success("Medicines retrieved successfully", PageResponse.of(result)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<MedicineResponseDto>> updateMedicine(
            @PathVariable UUID id, @Valid @RequestBody MedicineRequestDto requestDto) {
        MedicineResponseDto updated = medicineService.updateMedicine(id, requestDto);
        return ResponseEntity.ok(ApiResponse.success("Medicine updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteMedicine(@PathVariable UUID id) {
        medicineService.deleteMedicine(id);
        return ResponseEntity.ok(ApiResponse.success("Medicine deleted successfully", null));
    }

    @PostMapping("/{id}/stock")
    public ResponseEntity<ApiResponse<MedicineStockResponseDto>> addStock(
            @PathVariable UUID id, @Valid @RequestBody MedicineStockRequestDto requestDto) {
        MedicineStockResponseDto stock = medicineService.addStock(id, requestDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Stock added successfully", stock));
    }

    @GetMapping("/{id}/stock")
    public ResponseEntity<ApiResponse<List<MedicineStockResponseDto>>> getStock(@PathVariable UUID id) {
        List<MedicineStockResponseDto> stock = medicineService.getStockByMedicine(id);
        return ResponseEntity.ok(ApiResponse.success("Stock retrieved successfully", stock));
    }
}