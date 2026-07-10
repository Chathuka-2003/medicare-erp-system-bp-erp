package com.healthcare.backend.pharmacy.repository;

import com.healthcare.backend.pharmacy.entity.DrugDispense;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.List;
import java.util.UUID;

public interface DrugDispenseRepository extends JpaRepository<DrugDispense, UUID> {

    Optional<DrugDispense> findByDispenseNumber(String dispenseNumber);

    boolean existsByDispenseNumber(String dispenseNumber);

    List<DrugDispense> findByPatientId(UUID patientId);
}