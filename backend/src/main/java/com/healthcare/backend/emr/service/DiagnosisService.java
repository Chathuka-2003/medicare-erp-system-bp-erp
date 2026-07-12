package com.healthcare.backend.emr.service;

import com.healthcare.backend.emr.dto.DiagnosisRequestDto;
import com.healthcare.backend.emr.dto.DiagnosisResponseDto;
import java.util.List;
import java.util.UUID;

public interface DiagnosisService {

    DiagnosisResponseDto addDiagnosis(DiagnosisRequestDto requestDto);

    List<DiagnosisResponseDto> getDiagnosesByMedicalRecord(UUID medicalRecordId);

    DiagnosisResponseDto updateDiagnosis(UUID id, DiagnosisRequestDto requestDto);

    void deleteDiagnosis(UUID id);
}
