package com.healthcare.backend.emr.repository;

import com.healthcare.backend.emr.entity.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface PrescriptionRepository extends JpaRepository<Prescription, UUID> {

    Optional<Prescription> findByMedicalRecordId(UUID medicalRecordId);
}