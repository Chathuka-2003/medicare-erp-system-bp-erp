package com.healthcare.backend.inventory.service;

import com.healthcare.backend.common.exception.ResourceNotFoundException;
import com.healthcare.backend.inventory.dto.SupplierRequestDto;
import com.healthcare.backend.inventory.dto.SupplierResponseDto;
import com.healthcare.backend.inventory.entity.Supplier;
import com.healthcare.backend.inventory.repository.SupplierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class SupplierServiceImpl implements SupplierService {

    private final SupplierRepository supplierRepository;

    @Override
    public SupplierResponseDto createSupplier(SupplierRequestDto requestDto) {
        Supplier supplier = new Supplier();
        applyToEntity(supplier, requestDto);
        Supplier saved = supplierRepository.save(supplier);
        return toResponseDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public SupplierResponseDto getSupplierById(UUID id) {
        return toResponseDto(findSupplierOrThrow(id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<SupplierResponseDto> getAllSuppliers() {
        return supplierRepository.findAll().stream()
                .map(this::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public SupplierResponseDto updateSupplier(UUID id, SupplierRequestDto requestDto) {
        Supplier supplier = findSupplierOrThrow(id);
        applyToEntity(supplier, requestDto);
        Supplier updated = supplierRepository.save(supplier);
        return toResponseDto(updated);
    }

    @Override
    public void deleteSupplier(UUID id) {
        Supplier supplier = findSupplierOrThrow(id);
        supplierRepository.delete(supplier);
    }

    private void applyToEntity(Supplier supplier, SupplierRequestDto dto) {
        supplier.setSupplierName(dto.getSupplierName());
        supplier.setContactPerson(dto.getContactPerson());
        supplier.setPhone(dto.getPhone());
        supplier.setEmail(dto.getEmail());
        supplier.setAddress(dto.getAddress());
    }

    private SupplierResponseDto toResponseDto(Supplier supplier) {
        return SupplierResponseDto.builder()
                .id(supplier.getId())
                .supplierName(supplier.getSupplierName())
                .contactPerson(supplier.getContactPerson())
                .phone(supplier.getPhone())
                .email(supplier.getEmail())
                .address(supplier.getAddress())
                .createdAt(supplier.getCreatedAt())
                .updatedAt(supplier.getUpdatedAt())
                .build();
    }

    private Supplier findSupplierOrThrow(UUID id) {
        return supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found with id: " + id));
    }
}
