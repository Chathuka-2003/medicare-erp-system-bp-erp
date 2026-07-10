package com.healthcare.backend.inventory.repository;

import com.healthcare.backend.inventory.entity.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface SupplierRepository extends JpaRepository<Supplier, UUID> {

    boolean existsBySupplierName(String supplierName);
}