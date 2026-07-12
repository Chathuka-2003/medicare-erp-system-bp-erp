package com.healthcare.backend.emr.service;

import com.healthcare.backend.emr.dto.AllergyRequestDto;
import com.healthcare.backend.emr.dto.AllergyResponseDto;

import java.util.List;
import java.util.UUID;

public interface AllergyService {

    AllergyResponseDto addAllergy(UUID patientId, AllergyRequestDto requestDto);

    List<AllergyResponseDto> getAllergiesByPatient(UUID patientId);

    AllergyResponseDto updateAllergy(UUID allergyId, AllergyRequestDto requestDto);

    void deleteAllergy(UUID allergyId);
}
