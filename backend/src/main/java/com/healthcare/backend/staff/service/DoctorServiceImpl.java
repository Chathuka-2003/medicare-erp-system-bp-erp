package com.healthcare.backend.staff.service;

import com.healthcare.backend.common.exception.BusinessException;
import com.healthcare.backend.common.exception.ResourceNotFoundException;
import com.healthcare.backend.staff.dto.DoctorRequestDto;
import com.healthcare.backend.staff.dto.DoctorResponseDto;
import com.healthcare.backend.staff.entity.Department;
import com.healthcare.backend.staff.entity.Doctor;
import com.healthcare.backend.staff.entity.Specialization;
import com.healthcare.backend.staff.mapper.DoctorMapper;
import com.healthcare.backend.staff.repository.DepartmentRepository;
import com.healthcare.backend.staff.repository.DoctorRepository;
import com.healthcare.backend.staff.repository.SpecializationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class DoctorServiceImpl implements DoctorService {

    private final DoctorRepository doctorRepository;
    private final DepartmentRepository departmentRepository;
    private final SpecializationRepository specializationRepository;
    private final DoctorMapper doctorMapper;

    @Override
    public DoctorResponseDto createDoctor(DoctorRequestDto requestDto) {
        if (doctorRepository.existsByLicenseNumber(requestDto.getLicenseNumber())) {
            throw new BusinessException("A doctor with this license number already exists");
        }

        Department department = findDepartmentOrThrow(requestDto.getDepartmentId());
        Specialization specialization = requestDto.getSpecializationId() != null
                ? findSpecializationOrThrow(requestDto.getSpecializationId())
                : null;

        Doctor doctor = doctorMapper.toEntity(requestDto, department, specialization);
        Doctor saved = doctorRepository.save(doctor);
        return doctorMapper.toResponseDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public DoctorResponseDto getDoctorById(UUID id) {
        return doctorMapper.toResponseDto(findDoctorOrThrow(id));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<DoctorResponseDto> getAllDoctors(int page, int size, String sortBy, String sortDirection) {
        Pageable pageable = buildPageable(page, size, sortBy, sortDirection);
        return doctorRepository.findAll(pageable).map(doctorMapper::toResponseDto);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DoctorResponseDto> getDoctorsByDepartment(UUID departmentId) {
        return doctorRepository.findByDepartmentId(departmentId).stream()
                .map(doctorMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public DoctorResponseDto updateDoctor(UUID id, DoctorRequestDto requestDto) {
        Doctor doctor = findDoctorOrThrow(id);

        if (!requestDto.getLicenseNumber().equals(doctor.getLicenseNumber())
                && doctorRepository.existsByLicenseNumber(requestDto.getLicenseNumber())) {
            throw new BusinessException("A doctor with this license number already exists");
        }

        Department department = findDepartmentOrThrow(requestDto.getDepartmentId());
        Specialization specialization = requestDto.getSpecializationId() != null
                ? findSpecializationOrThrow(requestDto.getSpecializationId())
                : null;

        doctorMapper.applyToEntity(doctor, requestDto, department, specialization);
        Doctor updated = doctorRepository.save(doctor);
        return doctorMapper.toResponseDto(updated);
    }

    @Override
    public void deleteDoctor(UUID id) {
        Doctor doctor = findDoctorOrThrow(id);
        doctorRepository.delete(doctor);
    }

    private Doctor findDoctorOrThrow(UUID id) {
        return doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + id));
    }

    private Department findDepartmentOrThrow(UUID id) {
        return departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + id));
    }

    private Specialization findSpecializationOrThrow(UUID id) {
        return specializationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Specialization not found with id: " + id));
    }

    private Pageable buildPageable(int page, int size, String sortBy, String sortDirection) {
        Sort.Direction direction = "DESC".equalsIgnoreCase(sortDirection) ? Sort.Direction.DESC : Sort.Direction.ASC;
        String sortField = (sortBy == null || sortBy.isBlank()) ? "id" : sortBy;
        return PageRequest.of(page, size, Sort.by(direction, sortField));
    }
}