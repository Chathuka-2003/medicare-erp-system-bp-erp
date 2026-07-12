package com.healthcare.backend.staff.service;

import com.healthcare.backend.common.exception.BusinessException;
import com.healthcare.backend.common.exception.ResourceNotFoundException;
import com.healthcare.backend.staff.dto.StaffRequestDto;
import com.healthcare.backend.staff.dto.StaffResponseDto;
import com.healthcare.backend.staff.entity.Department;
import com.healthcare.backend.staff.entity.Doctor;
import com.healthcare.backend.staff.entity.Staff;
import com.healthcare.backend.staff.mapper.StaffMapper;
import com.healthcare.backend.staff.repository.DepartmentRepository;
import com.healthcare.backend.staff.repository.DoctorRepository;
import com.healthcare.backend.staff.repository.StaffRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class StaffServiceImpl implements StaffService {

    private final StaffRepository staffRepository;
    private final DepartmentRepository departmentRepository;
    private final DoctorRepository doctorRepository;
    private final StaffMapper staffMapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    public StaffResponseDto createStaff(StaffRequestDto requestDto) {
        if (staffRepository.existsByEmployeeNumber(requestDto.getEmployeeNumber())) {
            throw new BusinessException("A staff member with this employee number already exists");
        }
        if (requestDto.getEmail() != null && staffRepository.existsByEmail(requestDto.getEmail())) {
            throw new BusinessException("A staff member with this email already exists");
        }
        if (requestDto.getPassword() == null || requestDto.getPassword().isBlank()) {
            throw new BusinessException("Password is required when creating a staff member");
        }

        Department department = requestDto.getDepartmentId() != null
                ? findDepartmentOrThrow(requestDto.getDepartmentId())
                : null;
        Doctor doctor = requestDto.getDoctorId() != null
                ? findDoctorOrThrow(requestDto.getDoctorId())
                : null;

        Staff staff = staffMapper.toEntity(requestDto, department, doctor);
        staff.setPassword(passwordEncoder.encode(requestDto.getPassword()));

        Staff saved = staffRepository.save(staff);
        return staffMapper.toResponseDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public StaffResponseDto getStaffById(UUID id) {
        return staffMapper.toResponseDto(findStaffOrThrow(id));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<StaffResponseDto> getAllStaff(int page, int size, String sortBy, String sortDirection) {
        Pageable pageable = buildPageable(page, size, sortBy, sortDirection);
        return staffRepository.findAll(pageable).map(staffMapper::toResponseDto);
    }

    @Override
    @Transactional(readOnly = true)
    public List<StaffResponseDto> getStaffByDepartment(UUID departmentId) {
        return staffRepository.findByDepartmentId(departmentId).stream()
                .map(staffMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public StaffResponseDto updateStaff(UUID id, StaffRequestDto requestDto) {
        Staff staff = findStaffOrThrow(id);

        if (!requestDto.getEmployeeNumber().equals(staff.getEmployeeNumber())
                && staffRepository.existsByEmployeeNumber(requestDto.getEmployeeNumber())) {
            throw new BusinessException("A staff member with this employee number already exists");
        }

        Department department = requestDto.getDepartmentId() != null
                ? findDepartmentOrThrow(requestDto.getDepartmentId())
                : null;
        Doctor doctor = requestDto.getDoctorId() != null
                ? findDoctorOrThrow(requestDto.getDoctorId())
                : null;

        staffMapper.applyToEntity(staff, requestDto, department, doctor);

        if (requestDto.getPassword() != null && !requestDto.getPassword().isBlank()) {
            staff.setPassword(passwordEncoder.encode(requestDto.getPassword()));
        }

        Staff updated = staffRepository.save(staff);
        return staffMapper.toResponseDto(updated);
    }

    @Override
    public void deactivateStaff(UUID id) {
        Staff staff = findStaffOrThrow(id);
        staff.setActive(false);
        staffRepository.save(staff);
    }

    @Override
    public void deleteStaff(UUID id) {
        Staff staff = findStaffOrThrow(id);
        staffRepository.delete(staff);
    }

    private Staff findStaffOrThrow(UUID id) {
        return staffRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Staff member not found with id: " + id));
    }

    private Department findDepartmentOrThrow(UUID id) {
        return departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + id));
    }

    private Doctor findDoctorOrThrow(UUID id) {
        return doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + id));
    }

    private Pageable buildPageable(int page, int size, String sortBy, String sortDirection) {
        Sort.Direction direction = "DESC".equalsIgnoreCase(sortDirection) ? Sort.Direction.DESC : Sort.Direction.ASC;
        String sortField = (sortBy == null || sortBy.isBlank()) ? "id" : sortBy;
        return PageRequest.of(page, size, Sort.by(direction, sortField));
    }
}