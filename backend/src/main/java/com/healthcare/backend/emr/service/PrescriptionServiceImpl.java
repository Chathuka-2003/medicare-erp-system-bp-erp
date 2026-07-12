package com.healthcare.backend.emr.service;

import com.healthcare.backend.common.exception.BusinessException;
import com.healthcare.backend.common.exception.ResourceNotFoundException;
import com.healthcare.backend.emr.dto.PrescriptionRequestDto;
import com.healthcare.backend.emr.dto.PrescriptionResponseDto;
import com.healthcare.backend.emr.entity.MedicalRecord;
import com.healthcare.backend.emr.entity.Prescription;
import com.healthcare.backend.emr.mapper.PrescriptionMapper;
import com.healthcare.backend.emr.repository.MedicalRecordRepository;
import com.healthcare.backend.emr.repository.PrescriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class PrescriptionServiceImpl implements PrescriptionService {

    private final PrescriptionRepository prescriptionRepository;
    private final MedicalRecordRepository medicalRecordRepository;
    private final PrescriptionMapper prescriptionMapper;

    @Override
    public PrescriptionResponseDto createPrescription(UUID medicalRecordId, PrescriptionRequestDto requestDto) {
        MedicalRecord record = findRecordOrThrow(medicalRecordId);

        if (prescriptionRepository.findByMedicalRecordId(medicalRecordId).isPresent()) {
            throw new BusinessException("A prescription already exists for this medical record");
        }

        Prescription prescription = prescriptionMapper.toEntity(requestDto, record);
        Prescription saved = prescriptionRepository.save(prescription);
        return prescriptionMapper.toResponseDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public PrescriptionResponseDto getPrescriptionByMedicalRecord(UUID medicalRecordId) {
        Prescription prescription = prescriptionRepository.findByMedicalRecordId(medicalRecordId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No prescription found for medical record: " + medicalRecordId));
        return prescriptionMapper.toResponseDto(prescription);
    }

    @Override
    public PrescriptionResponseDto updatePrescription(UUID id, PrescriptionRequestDto requestDto) {
        Prescription prescription = findPrescriptionOrThrow(id);
        prescriptionMapper.applyToEntity(prescription, requestDto, prescription.getMedicalRecord());
        Prescription updated = prescriptionRepository.save(prescription);
        return prescriptionMapper.toResponseDto(updated);
    }

    @Override
    public void deletePrescription(UUID id) {
        Prescription prescription = findPrescriptionOrThrow(id);
        prescriptionRepository.delete(prescription);
    }

    private Prescription findPrescriptionOrThrow(UUID id) {
        return prescriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Prescription not found with id: " + id));
    }

    private MedicalRecord findRecordOrThrow(UUID id) {
        return medicalRecordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medical record not found with id: " + id));
    }
}