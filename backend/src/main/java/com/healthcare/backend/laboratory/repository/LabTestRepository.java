package com.healthcare.backend.laboratory.repository;

import com.healthcare.backend.laboratory.entity.LabTest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;
import java.util.UUID;

public interface LabTestRepository extends JpaRepository<LabTest, UUID>, JpaSpecificationExecutor<LabTest> {

    Optional<LabTest> findByTestCode(String testCode);

    boolean existsByTestCode(String testCode);
}