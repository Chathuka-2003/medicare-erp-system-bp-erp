package com.healthcare.backend.inventory.repository;

import com.healthcare.backend.inventory.entity.PurchaseOrder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, UUID> {

    Optional<PurchaseOrder> findByPurchaseOrderNumber(String purchaseOrderNumber);

    boolean existsByPurchaseOrderNumber(String purchaseOrderNumber);

    List<PurchaseOrder> findBySupplierId(UUID supplierId);
}