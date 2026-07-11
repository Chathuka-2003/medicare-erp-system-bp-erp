package com.healthcare.backend.staff.mapper;

import com.healthcare.backend.staff.dto.DoctorRequestDto;
import com.healthcare.backend.staff.dto.DoctorResponseDto;
import com.healthcare.backend.staff.entity.Department;
import com.healthcare.backend.staff.entity.Doctor;
import com.healthcare.backend.staff.entity.Specialization;
import org.springframework.stereotype.Component;

@Component
public class DoctorMapper {

    public Doctor toEntity(DoctorRequestDto dto, Department department, Specialization specialization) {
        Doctor doctor = new Doctor();
        applyToEntity(doctor, dto, department, specialization);
        return doctor;
    }

    public void applyToEntity(Doctor doctor, DoctorRequestDto dto, Department department, Specialization specialization) {
        doctor.setFirstName(dto.getFirstName());
        doctor.setLastName(dto.getLastName());
        doctor.setLicenseNumber(dto.getLicenseNumber());
        doctor.setEmail(dto.getEmail());
        doctor.setPhone(dto.getPhone());
        doctor.setDepartment(department);
        doctor.setSpecialization(specialization);
    }

    public DoctorResponseDto toResponseDto(Doctor doctor) {
        DoctorResponseDto.DoctorResponseDtoBuilder builder = DoctorResponseDto.builder()
                .id(doctor.getId())
                .firstName(doctor.getFirstName())
                .lastName(doctor.getLastName())
                .licenseNumber(doctor.getLicenseNumber())
                .email(doctor.getEmail())
                .phone(doctor.getPhone())
                .createdAt(doctor.getCreatedAt())
                .updatedAt(doctor.getUpdatedAt());

        if (doctor.getDepartment() != null) {
            builder.departmentId(doctor.getDepartment().getId());
            builder.departmentName(doctor.getDepartment().getName());
        }

        if (doctor.getSpecialization() != null) {
            builder.specializationId(doctor.getSpecialization().getId());
            builder.specializationName(doctor.getSpecialization().getName());
        }

        return builder.build();
    }
}