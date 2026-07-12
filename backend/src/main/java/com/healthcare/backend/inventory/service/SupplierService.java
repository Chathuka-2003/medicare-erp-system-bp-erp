package com.healthcare.backend.inventory.service;

import com.healthcare.backend.inventory.dto.SupplierRequestDto;
import com.healthcare.backend.inventory.dto.SupplierResponseDto;

import java.util.List;
import java.util.UUID;

public interface SupplierService {

    SupplierResponseDto createSupplier(SupplierRequestDto requestDto);

    SupplierResponseDto getSupplierById(UUID id);

    List<SupplierResponseDto> getAllSuppliers();

    SupplierResponseDto updateSupplier(UUID id, SupplierRequestDto requestDto);

    void deleteSupplier(UUID id);
}
