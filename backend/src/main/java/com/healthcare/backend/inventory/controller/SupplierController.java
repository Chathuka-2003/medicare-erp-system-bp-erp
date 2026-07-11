package com.healthcare.backend.inventory.controller;

import com.healthcare.backend.common.dto.ApiResponse;
import com.healthcare.backend.inventory.dto.SupplierRequestDto;
import com.healthcare.backend.inventory.dto.SupplierResponseDto;
import com.healthcare.backend.inventory.service.SupplierService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/suppliers")
@RequiredArgsConstructor
public class SupplierController {

    private final SupplierService supplierService;

    @PostMapping
    public ResponseEntity<ApiResponse<SupplierResponseDto>> createSupplier(
            @Valid @RequestBody SupplierRequestDto requestDto) {
        SupplierResponseDto created = supplierService.createSupplier(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Supplier created successfully", created));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SupplierResponseDto>> getSupplierById(@PathVariable UUID id) {
        SupplierResponseDto supplier = supplierService.getSupplierById(id);
        return ResponseEntity.ok(ApiResponse.success("Supplier retrieved successfully", supplier));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<SupplierResponseDto>>> getAllSuppliers() {
        List<SupplierResponseDto> suppliers = supplierService.getAllSuppliers();
        return ResponseEntity.ok(ApiResponse.success("Suppliers retrieved successfully", suppliers));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<SupplierResponseDto>> updateSupplier(
            @PathVariable UUID id, @Valid @RequestBody SupplierRequestDto requestDto) {
        SupplierResponseDto updated = supplierService.updateSupplier(id, requestDto);
        return ResponseEntity.ok(ApiResponse.success("Supplier updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteSupplier(@PathVariable UUID id) {
        supplierService.deleteSupplier(id);
        return ResponseEntity.ok(ApiResponse.success("Supplier deleted successfully", null));
    }
}
