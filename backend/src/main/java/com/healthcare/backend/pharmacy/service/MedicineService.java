package com.healthcare.backend.pharmacy.service;

import com.healthcare.backend.pharmacy.dto.MedicineRequestDto;
import com.healthcare.backend.pharmacy.dto.MedicineResponseDto;
import com.healthcare.backend.pharmacy.dto.MedicineStockRequestDto;
import com.healthcare.backend.pharmacy.dto.MedicineStockResponseDto;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.UUID;

public interface MedicineService {

    MedicineResponseDto createMedicine(MedicineRequestDto requestDto);

    MedicineResponseDto getMedicineById(UUID id);

    Page<MedicineResponseDto> getAllMedicines(int page, int size, String sortBy, String sortDirection);

    MedicineResponseDto updateMedicine(UUID id, MedicineRequestDto requestDto);

    void deleteMedicine(UUID id);

    MedicineStockResponseDto addStock(UUID medicineId, MedicineStockRequestDto requestDto);

    List<MedicineStockResponseDto> getStockByMedicine(UUID medicineId);
}