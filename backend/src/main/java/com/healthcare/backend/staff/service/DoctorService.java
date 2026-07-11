package com.healthcare.backend.staff.service;

import com.healthcare.backend.staff.dto.DoctorRequestDto;
import com.healthcare.backend.staff.dto.DoctorResponseDto;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.UUID;

public interface DoctorService {

    DoctorResponseDto createDoctor(DoctorRequestDto requestDto);

    DoctorResponseDto getDoctorById(UUID id);

    Page<DoctorResponseDto> getAllDoctors(int page, int size, String sortBy, String sortDirection);

    List<DoctorResponseDto> getDoctorsByDepartment(UUID departmentId);

    DoctorResponseDto updateDoctor(UUID id, DoctorRequestDto requestDto);

    void deleteDoctor(UUID id);
}