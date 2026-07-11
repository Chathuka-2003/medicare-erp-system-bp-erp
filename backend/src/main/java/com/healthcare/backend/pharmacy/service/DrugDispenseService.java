package com.healthcare.backend.pharmacy.service;

import com.healthcare.backend.pharmacy.dto.DrugDispenseRequestDto;
import com.healthcare.backend.pharmacy.dto.DrugDispenseResponseDto;

import java.util.List;
import java.util.UUID;

public interface DrugDispenseService {

    DrugDispenseResponseDto createDispense(DrugDispenseRequestDto requestDto);

    DrugDispenseResponseDto getDispenseById(UUID id);

    List<DrugDispenseResponseDto> getDispensesByPatient(UUID patientId);
}