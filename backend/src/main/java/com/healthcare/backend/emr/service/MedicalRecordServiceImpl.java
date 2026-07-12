package com.healthcare.backend.emr.service;

import com.healthcare.backend.common.exception.ResourceNotFoundException;
import com.healthcare.backend.emr.dto.MedicalRecordRequestDto;
import com.healthcare.backend.emr.dto.MedicalRecordResponseDto;
import com.healthcare.backend.emr.entity.MedicalRecord;
import com.healthcare.backend.emr.mapper.MedicalRecordMapper;
import com.healthcare.backend.emr.repository.MedicalRecordRepository;
import com.healthcare.backend.patient.entity.Patient;
import com.healthcare.backend.patient.repository.PatientRepository;
import com.healthcare.backend.staff.entity.Doctor;
import com.healthcare.backend.staff.repository.DoctorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class MedicalRecordServiceImpl implements MedicalRecordService {

    private final MedicalRecordRepository medicalRecordRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final MedicalRecordMapper medicalRecordMapper;

    @Override
    public MedicalRecordResponseDto createMedicalRecord(MedicalRecordRequestDto requestDto) {
        Patient patient = findPatientOrThrow(requestDto.getPatientId());
        Doctor doctor = findDoctorOrThrow(requestDto.getDoctorId());

        MedicalRecord record = medicalRecordMapper.toEntity(requestDto, patient, doctor);
        MedicalRecord saved = medicalRecordRepository.save(record);
        return medicalRecordMapper.toResponseDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public MedicalRecordResponseDto getMedicalRecordById(UUID id) {
        return medicalRecordMapper.toResponseDto(findRecordOrThrow(id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<MedicalRecordResponseDto> getMedicalRecordsByPatient(UUID patientId) {
        return medicalRecordRepository.findByPatientId(patientId).stream()
                .map(medicalRecordMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<MedicalRecordResponseDto> getMedicalRecordsByDoctor(UUID doctorId) {
        return medicalRecordRepository.findByDoctorId(doctorId).stream()
                .map(medicalRecordMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public MedicalRecordResponseDto updateMedicalRecord(UUID id, MedicalRecordRequestDto requestDto) {
        MedicalRecord record = findRecordOrThrow(id);
        Patient patient = findPatientOrThrow(requestDto.getPatientId());
        Doctor doctor = findDoctorOrThrow(requestDto.getDoctorId());

        medicalRecordMapper.applyToEntity(record, requestDto, patient, doctor);
        MedicalRecord updated = medicalRecordRepository.save(record);
        return medicalRecordMapper.toResponseDto(updated);
    }

    @Override
    public void deleteMedicalRecord(UUID id) {
        MedicalRecord record = findRecordOrThrow(id);
        medicalRecordRepository.delete(record);
    }

    private MedicalRecord findRecordOrThrow(UUID id) {
        return medicalRecordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medical record not found with id: " + id));
    }

    private Patient findPatientOrThrow(UUID id) {
        return patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + id));
    }

    private Doctor findDoctorOrThrow(UUID id) {
        return doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + id));
    }
}