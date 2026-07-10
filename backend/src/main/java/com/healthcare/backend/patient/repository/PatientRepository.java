package com.healthcare.backend.patient.repository;

import com.healthcare.backend.patient.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;
import java.util.UUID;

public interface PatientRepository extends JpaRepository<Patient, UUID>, JpaSpecificationExecutor<Patient> {

    Optional<Patient> findByPatientNumber(String patientNumber);

    Optional<Patient> findByNic(String nic);

    boolean existsByNic(String nic);

    boolean existsByPatientNumber(String patientNumber);

    boolean existsByEmail(String email);
}