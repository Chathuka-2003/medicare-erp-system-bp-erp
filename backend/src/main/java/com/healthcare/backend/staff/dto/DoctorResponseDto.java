package com.healthcare.backend.staff.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DoctorResponseDto {

    private UUID id;
    private String firstName;
    private String lastName;
    private String licenseNumber;
    private String email;
    private String phone;

    private UUID departmentId;
    private String departmentName;

    private UUID specializationId;
    private String specializationName;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}