package com.healthcare.backend.pharmacy.mapper;

import com.healthcare.backend.pharmacy.dto.MedicineRequestDto;
import com.healthcare.backend.pharmacy.dto.MedicineResponseDto;
import com.healthcare.backend.pharmacy.entity.Medicine;
import com.healthcare.backend.pharmacy.entity.MedicineStock;
import org.springframework.stereotype.Component;

@Component
public class MedicineMapper {

    public Medicine toEntity(MedicineRequestDto dto) {
        Medicine medicine = new Medicine();
        applyToEntity(medicine, dto);
        return medicine;
    }

    public void applyToEntity(Medicine medicine, MedicineRequestDto dto) {
        medicine.setMedicineCode(dto.getMedicineCode());
        medicine.setMedicineName(dto.getMedicineName());
        medicine.setGenericName(dto.getGenericName());
        medicine.setManufacturer(dto.getManufacturer());
        medicine.setCategory(dto.getCategory());
        medicine.setDosageForm(dto.getDosageForm());
        medicine.setStrength(dto.getStrength());
        medicine.setUnitPrice(dto.getUnitPrice());
    }

    public MedicineResponseDto toResponseDto(Medicine medicine) {
        int totalStock = medicine.getStocks() == null
                ? 0
                : medicine.getStocks().stream()
                .mapToInt(MedicineStock::getQuantityInStock)
                .sum();

        return MedicineResponseDto.builder()
                .id(medicine.getId())
                .medicineCode(medicine.getMedicineCode())
                .medicineName(medicine.getMedicineName())
                .genericName(medicine.getGenericName())
                .manufacturer(medicine.getManufacturer())
                .category(medicine.getCategory())
                .dosageForm(medicine.getDosageForm())
                .strength(medicine.getStrength())
                .unitPrice(medicine.getUnitPrice())
                .totalStock(totalStock)
                .createdAt(medicine.getCreatedAt())
                .updatedAt(medicine.getUpdatedAt())
                .build();
    }
}