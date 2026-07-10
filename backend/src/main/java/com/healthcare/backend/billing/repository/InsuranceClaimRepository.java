package com.healthcare.backend.billing.repository;

import com.healthcare.backend.billing.entity.InsuranceClaim;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface InsuranceClaimRepository extends JpaRepository<InsuranceClaim, UUID> {

    Optional<InsuranceClaim> findByClaimNumber(String claimNumber);

    boolean existsByClaimNumber(String claimNumber);

    List<InsuranceClaim> findByPatientId(UUID patientId);
}