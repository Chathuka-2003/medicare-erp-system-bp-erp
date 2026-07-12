package com.healthcare.backend.emr.service;

import com.healthcare.backend.common.exception.ResourceNotFoundException;
import com.healthcare.backend.emr.dto.AllergyRequestDto;
import com.healthcare.backend.emr.dto.AllergyResponseDto;
import com.healthcare.backend.emr.entity.Allergy;
import com.healthcare.backend.emr.repository.AllergyRepository;
import com.healthcare.backend.patient.entity.Patient;
import com.healthcare.backend.patient.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class AllergyServiceImpl implements AllergyService {

    private final AllergyRepository allergyRepository;
    private final PatientRepository patientRepository;

    @Override
    public AllergyResponseDto addAllergy(UUID patientId, AllergyRequestDto requestDto) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + patientId));

        Allergy allergy = new Allergy();
        allergy.setAllergyName(requestDto.getAllergyName());
        allergy.setDescription(requestDto.getDescription());
        allergy.setSeverity(requestDto.getSeverity());
        allergy.setPatient(patient);

        Allergy saved = allergyRepository.save(allergy);
        return toResponseDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AllergyResponseDto> getAllergiesByPatient(UUID patientId) {
        return allergyRepository.findByPatientId(patientId).stream()
                .map(this::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public AllergyResponseDto updateAllergy(UUID allergyId, AllergyRequestDto requestDto) {
        Allergy allergy = allergyRepository.findById(allergyId)
                .orElseThrow(() -> new ResourceNotFoundException("Allergy not found with id: " + allergyId));
        allergy.setAllergyName(requestDto.getAllergyName());
        allergy.setDescription(requestDto.getDescription());
        allergy.setSeverity(requestDto.getSeverity());
        Allergy updated = allergyRepository.save(allergy);
        return toResponseDto(updated);
    }

    @Override
    public void deleteAllergy(UUID allergyId) {
        Allergy allergy = allergyRepository.findById(allergyId)
                .orElseThrow(() -> new ResourceNotFoundException("Allergy not found with id: " + allergyId));
        allergyRepository.delete(allergy);
    }

    private AllergyResponseDto toResponseDto(Allergy allergy) {
        return AllergyResponseDto.builder()
                .id(allergy.getId())
                .allergyName(allergy.getAllergyName())
                .description(allergy.getDescription())
                .severity(allergy.getSeverity())
                .patientId(allergy.getPatient() != null ? allergy.getPatient().getId() : null)
                .createdAt(allergy.getCreatedAt())
                .build();
    }
}
