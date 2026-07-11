package com.healthcare.backend.patient.service;

import com.healthcare.backend.patient.dto.PatientRequestDto;
import com.healthcare.backend.patient.dto.PatientResponseDto;
import com.healthcare.backend.patient.dto.PatientSearchDto;
import org.springframework.data.domain.Page;

import java.util.UUID;

public interface PatientService {

    PatientResponseDto createPatient(PatientRequestDto requestDto);

    PatientResponseDto getPatientById(UUID id);

    PatientResponseDto getPatientByPatientNumber(String patientNumber);

    Page<PatientResponseDto> getAllPatients(int page, int size, String sortBy, String sortDirection);

    PatientResponseDto updatePatient(UUID id, PatientRequestDto requestDto);

    void deletePatient(UUID id);

    Page<PatientResponseDto> searchPatients(PatientSearchDto searchDto);
}