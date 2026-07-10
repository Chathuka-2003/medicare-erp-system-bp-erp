package com.healthcare.backend.laboratory.repository;

import com.healthcare.backend.laboratory.entity.LabOrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface LabOrderItemRepository extends JpaRepository<LabOrderItem, UUID> {
}