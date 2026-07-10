package com.healthcare.backend.pharmacy.repository;

import com.healthcare.backend.pharmacy.entity.MedicineStock;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface MedicineStockRepository extends JpaRepository<MedicineStock, UUID> {

    List<MedicineStock> findByMedicineId(UUID medicineId);

    List<MedicineStock> findByMedicineIdAndQuantityInStockGreaterThanOrderByExpiryDateAsc(
            UUID medicineId, Integer quantity);
}