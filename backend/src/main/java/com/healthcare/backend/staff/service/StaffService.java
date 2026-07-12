package com.healthcare.backend.staff.service;

import com.healthcare.backend.staff.dto.StaffRequestDto;
import com.healthcare.backend.staff.dto.StaffResponseDto;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.UUID;

public interface StaffService {

    StaffResponseDto createStaff(StaffRequestDto requestDto);

    StaffResponseDto getStaffById(UUID id);

    Page<StaffResponseDto> getAllStaff(int page, int size, String sortBy, String sortDirection);

    List<StaffResponseDto> getStaffByDepartment(UUID departmentId);

    StaffResponseDto updateStaff(UUID id, StaffRequestDto requestDto);

    void deactivateStaff(UUID id);

    void deleteStaff(UUID id);
}