package com.healthcare.backend.patient.service;

import com.healthcare.backend.common.exception.BusinessException;
import com.healthcare.backend.common.exception.ResourceNotFoundException;
import com.healthcare.backend.patient.dto.PatientRequestDto;
import com.healthcare.backend.patient.dto.PatientResponseDto;
import com.healthcare.backend.patient.dto.PatientSearchDto;
import com.healthcare.backend.patient.entity.Patient;
import com.healthcare.backend.patient.mapper.PatientMapper;
import com.healthcare.backend.patient.repository.PatientRepository;
import com.healthcare.backend.patient.repository.PatientSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Year;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;

@Service
@RequiredArgsConstructor
@Transactional
public class PatientServiceImpl implements PatientService {

    private final PatientRepository patientRepository;
    private final PatientMapper patientMapper;

    private static final AtomicInteger SEQUENCE = new AtomicInteger(1);

    @Override
    public PatientResponseDto createPatient(PatientRequestDto requestDto) {
        if (requestDto.getNic() != null && patientRepository.existsByNic(requestDto.getNic())) {
            throw new BusinessException("A patient with this NIC already exists");
        }
        if (requestDto.getEmail() != null && patientRepository.existsByEmail(requestDto.getEmail())) {
            throw new BusinessException("A patient with this email already exists");
        }

        Patient patient = patientMapper.toEntity(requestDto);
        patient.setPatientNumber(generatePatientNumber());

        Patient saved = patientRepository.save(patient);
        return patientMapper.toResponseDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public PatientResponseDto getPatientById(UUID id) {
        Patient patient = findPatientOrThrow(id);
        return patientMapper.toResponseDto(patient);
    }

    @Override
    @Transactional(readOnly = true)
    public PatientResponseDto getPatientByPatientNumber(String patientNumber) {
        Patient patient = patientRepository.findByPatientNumber(patientNumber)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Patient not found with patient number: " + patientNumber));
        return patientMapper.toResponseDto(patient);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PatientResponseDto> getAllPatients(int page, int size, String sortBy, String sortDirection) {
        Pageable pageable = buildPageable(page, size, sortBy, sortDirection);
        return patientRepository.findAll(pageable).map(patientMapper::toResponseDto);
    }

    @Override
    public PatientResponseDto updatePatient(UUID id, PatientRequestDto requestDto) {
        Patient patient = findPatientOrThrow(id);

        if (requestDto.getNic() != null
                && !requestDto.getNic().equals(patient.getNic())
                && patientRepository.existsByNic(requestDto.getNic())) {
            throw new BusinessException("A patient with this NIC already exists");
        }

        patientMapper.applyToEntity(patient, requestDto);
        Patient updated = patientRepository.save(patient);
        return patientMapper.toResponseDto(updated);
    }

    @Override
    public void deletePatient(UUID id) {
        Patient patient = findPatientOrThrow(id);
        patientRepository.delete(patient);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PatientResponseDto> searchPatients(PatientSearchDto searchDto) {
        Pageable pageable = buildPageable(
                searchDto.getPage(), searchDto.getSize(), searchDto.getSortBy(), searchDto.getSortDirection());

        return patientRepository.findAll(PatientSpecification.withFilters(searchDto), pageable)
                .map(patientMapper::toResponseDto);
    }

    private Patient findPatientOrThrow(UUID id) {
        return patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + id));
    }

    private Pageable buildPageable(int page, int size, String sortBy, String sortDirection) {
        Sort.Direction direction = "DESC".equalsIgnoreCase(sortDirection) ? Sort.Direction.DESC : Sort.Direction.ASC;
        String sortField = (sortBy == null || sortBy.isBlank()) ? "id" : sortBy;
        return PageRequest.of(page, size, Sort.by(direction, sortField));
    }

    private synchronized String generatePatientNumber() {
        int year = Year.now().getValue();
        int seq = SEQUENCE.getAndIncrement();
        String candidate;
        do {
            candidate = String.format("PT-%d-%05d", year, seq);
            seq = SEQUENCE.getAndIncrement();
        } while (patientRepository.existsByPatientNumber(candidate));
        return candidate;
    }
}