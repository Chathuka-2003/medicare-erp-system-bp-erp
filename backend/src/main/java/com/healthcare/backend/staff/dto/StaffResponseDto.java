package com.healthcare.backend.staff.dto;

import com.healthcare.backend.common.enums.UserRole;
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
public class StaffResponseDto {

    private UUID id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String employeeNumber;
    private UserRole role;
    private boolean active;

    private UUID departmentId;
    private String departmentName;

    private UUID doctorId;
    private String doctorName;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}