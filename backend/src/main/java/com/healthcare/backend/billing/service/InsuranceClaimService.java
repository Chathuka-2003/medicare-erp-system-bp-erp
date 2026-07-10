package com.healthcare.backend.billing.service;

import com.healthcare.backend.billing.dto.InsuranceClaimRequestDto;
import com.healthcare.backend.billing.dto.InsuranceClaimResponseDto;

import java.util.List;
import java.util.UUID;

public interface InsuranceClaimService {

    InsuranceClaimResponseDto createClaim(InsuranceClaimRequestDto requestDto);

    InsuranceClaimResponseDto getClaimById(UUID id);

    List<InsuranceClaimResponseDto> getClaimsByPatient(UUID patientId);

    InsuranceClaimResponseDto updateClaim(UUID id, InsuranceClaimRequestDto requestDto);

    void deleteClaim(UUID id);
}