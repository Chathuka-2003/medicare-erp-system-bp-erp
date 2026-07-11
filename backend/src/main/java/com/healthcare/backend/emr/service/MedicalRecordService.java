package com.healthcare.backend.emr.service;

import com.healthcare.backend.emr.dto.MedicalRecordRequestDto;
import com.healthcare.backend.emr.dto.MedicalRecordResponseDto;

import java.util.List;
import java.util.UUID;

public interface MedicalRecordService {

    MedicalRecordResponseDto createMedicalRecord(MedicalRecordRequestDto requestDto);

    MedicalRecordResponseDto getMedicalRecordById(UUID id);

    List<MedicalRecordResponseDto> getMedicalRecordsByPatient(UUID patientId);

    List<MedicalRecordResponseDto> getMedicalRecordsByDoctor(UUID doctorId);

    MedicalRecordResponseDto updateMedicalRecord(UUID id, MedicalRecordRequestDto requestDto);

    void deleteMedicalRecord(UUID id);
}