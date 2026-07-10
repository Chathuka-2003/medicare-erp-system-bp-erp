package com.healthcare.backend.ward.repository;

import com.healthcare.backend.ward.entity.Admission;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AdmissionRepository extends JpaRepository<Admission, UUID> {

    Optional<Admission> findByAdmissionNumber(String admissionNumber);

    boolean existsByAdmissionNumber(String admissionNumber);

    List<Admission> findByPatientId(UUID patientId);

    List<Admission> findByDischargeDateIsNull();
}