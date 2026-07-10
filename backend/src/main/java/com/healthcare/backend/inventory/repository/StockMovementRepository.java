package com.healthcare.backend.inventory.repository;

import com.healthcare.backend.inventory.entity.StockMovement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface StockMovementRepository extends JpaRepository<StockMovement, UUID> {

    List<StockMovement> findByItemId(UUID itemId);
}