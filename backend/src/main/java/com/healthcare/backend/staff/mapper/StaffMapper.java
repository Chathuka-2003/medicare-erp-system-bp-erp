package com.healthcare.backend.staff.mapper;

import com.healthcare.backend.staff.dto.StaffRequestDto;
import com.healthcare.backend.staff.dto.StaffResponseDto;
import com.healthcare.backend.staff.entity.Department;
import com.healthcare.backend.staff.entity.Doctor;
import com.healthcare.backend.staff.entity.Staff;
import org.springframework.stereotype.Component;

@Component
public class StaffMapper {

    public Staff toEntity(StaffRequestDto dto, Department department, Doctor doctor) {
        Staff staff = new Staff();
        applyToEntity(staff, dto, department, doctor);
        return staff;
    }

    public void applyToEntity(Staff staff, StaffRequestDto dto, Department department, Doctor doctor) {
        staff.setFirstName(dto.getFirstName());
        staff.setLastName(dto.getLastName());
        staff.setEmail(dto.getEmail());
        staff.setPhone(dto.getPhone());
        staff.setEmployeeNumber(dto.getEmployeeNumber());
        staff.setRole(dto.getRole());
        staff.setActive(dto.getActive() == null || dto.getActive());
        staff.setDepartment(department);
        staff.setDoctor(doctor);
        // password is deliberately handled in the service layer (needs encoding)
    }

    public StaffResponseDto toResponseDto(Staff staff) {
        StaffResponseDto.StaffResponseDtoBuilder builder = StaffResponseDto.builder()
                .id(staff.getId())
                .firstName(staff.getFirstName())
                .lastName(staff.getLastName())
                .email(staff.getEmail())
                .phone(staff.getPhone())
                .employeeNumber(staff.getEmployeeNumber())
                .role(staff.getRole())
                .active(staff.isActive())
                .createdAt(staff.getCreatedAt())
                .updatedAt(staff.getUpdatedAt());

        if (staff.getDepartment() != null) {
            builder.departmentId(staff.getDepartment().getId());
            builder.departmentName(staff.getDepartment().getName());
        }

        if (staff.getDoctor() != null) {
            builder.doctorId(staff.getDoctor().getId());
            builder.doctorName((staff.getDoctor().getFirstName() + " " +
                    (staff.getDoctor().getLastName() != null ? staff.getDoctor().getLastName() : "")).trim());
        }

        return builder.build();
    }
}