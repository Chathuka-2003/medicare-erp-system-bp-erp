package com.healthcare.backend.laboratory.repository;

import com.healthcare.backend.laboratory.entity.LabResult;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface LabResultRepository extends JpaRepository<LabResult, UUID> {

    Optional<LabResult> findByLabOrderItemId(UUID labOrderItemId);
}