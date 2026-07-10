package com.healthcare.backend.emr.repository;

import com.healthcare.backend.emr.entity.Diagnosis;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface DiagnosisRepository extends JpaRepository<Diagnosis, UUID> {

    List<Diagnosis> findByMedicalRecordId(UUID medicalRecordId);
}