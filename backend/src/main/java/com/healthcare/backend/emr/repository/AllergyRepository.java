package com.healthcare.backend.emr.repository;

import com.healthcare.backend.emr.entity.Allergy;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface AllergyRepository extends JpaRepository<Allergy, UUID> {

    List<Allergy> findByPatientId(UUID patientId);
}