package com.healthcare.backend.ward.service;

import com.healthcare.backend.ward.dto.AdmissionRequestDto;
import com.healthcare.backend.ward.dto.AdmissionResponseDto;

import java.util.List;
import java.util.UUID;

public interface AdmissionService {

    AdmissionResponseDto admitPatient(AdmissionRequestDto requestDto);

    AdmissionResponseDto getAdmissionById(UUID id);

    List<AdmissionResponseDto> getAdmissionsByPatient(UUID patientId);

    List<AdmissionResponseDto> getCurrentAdmissions();

    AdmissionResponseDto dischargePatient(UUID id);
}
