package com.healthcare.backend.emr.service;

public interface DiagnosisService {

    DiagnosisResponseDto addDiagnosis(DiagnosisRequestDto requestDto);

    List<DiagnosisResponseDto> getDiagnosesByMedicalRecord(UUID medicalRecordId);

    DiagnosisResponseDto updateDiagnosis(UUID id, DiagnosisRequestDto requestDto);

    void deleteDiagnosis(UUID id);
}