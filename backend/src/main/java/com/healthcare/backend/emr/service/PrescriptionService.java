package com.healthcare.backend.emr.service;

import com.healthcare.backend.emr.dto.PrescriptionRequestDto;
import com.healthcare.backend.emr.dto.PrescriptionResponseDto;

import java.util.UUID;

public interface PrescriptionService {

    PrescriptionResponseDto createPrescription(UUID medicalRecordId, PrescriptionRequestDto requestDto);

    PrescriptionResponseDto getPrescriptionByMedicalRecord(UUID medicalRecordId);

    PrescriptionResponseDto updatePrescription(UUID id, PrescriptionRequestDto requestDto);

    void deletePrescription(UUID id);
}