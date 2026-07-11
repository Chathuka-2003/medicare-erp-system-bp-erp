package com.healthcare.backend.emr.service;

import com.healthcare.backend.common.exception.ResourceNotFoundException;
import com.healthcare.backend.emr.dto.DiagnosisRequestDto;
import com.healthcare.backend.emr.dto.DiagnosisResponseDto;
import com.healthcare.backend.emr.entity.Diagnosis;
import com.healthcare.backend.emr.entity.MedicalRecord;
import com.healthcare.backend.emr.repository.DiagnosisRepository;
import com.healthcare.backend.emr.repository.MedicalRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class DiagnosisServiceImpl implements DiagnosisService {

    private final DiagnosisRepository diagnosisRepository;
    private final MedicalRecordRepository medicalRecordRepository;

    @Override
    public DiagnosisResponseDto addDiagnosis(DiagnosisRequestDto requestDto) {
        MedicalRecord record = medicalRecordRepository.findById(requestDto.getMedicalRecordId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Medical record not found with id: " + requestDto.getMedicalRecordId()));

        Diagnosis diagnosis = new Diagnosis();
        diagnosis.setDiagnosisName(requestDto.getDiagnosisName());
        diagnosis.setDescription(requestDto.getDescription());
        diagnosis.setSeverity(requestDto.getSeverity());
        diagnosis.setMedicalRecord(record);

        Diagnosis saved = diagnosisRepository.save(diagnosis);
        return toResponseDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DiagnosisResponseDto> getDiagnosesByMedicalRecord(UUID medicalRecordId) {
        return diagnosisRepository.findByMedicalRecordId(medicalRecordId).stream()
                .map(this::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public DiagnosisResponseDto updateDiagnosis(UUID id, DiagnosisRequestDto requestDto) {
        Diagnosis diagnosis = findDiagnosisOrThrow(id);
        diagnosis.setDiagnosisName(requestDto.getDiagnosisName());
        diagnosis.setDescription(requestDto.getDescription());
        diagnosis.setSeverity(requestDto.getSeverity());

        Diagnosis updated = diagnosisRepository.save(diagnosis);
        return toResponseDto(updated);
    }

    @Override
    public void deleteDiagnosis(UUID id) {
        Diagnosis diagnosis = findDiagnosisOrThrow(id);
        diagnosisRepository.delete(diagnosis);
    }

    private Diagnosis findDiagnosisOrThrow(UUID id) {
        return diagnosisRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Diagnosis not found with id: " + id));
    }

    private DiagnosisResponseDto toResponseDto(Diagnosis diagnosis) {
        return DiagnosisResponseDto.builder()
                .id(diagnosis.getId())
                .medicalRecordId(diagnosis.getMedicalRecord() != null ? diagnosis.getMedicalRecord().getId() : null)
                .diagnosisName(diagnosis.getDiagnosisName())
                .description(diagnosis.getDescription())
                .severity(diagnosis.getSeverity())
                .build();
    }
}