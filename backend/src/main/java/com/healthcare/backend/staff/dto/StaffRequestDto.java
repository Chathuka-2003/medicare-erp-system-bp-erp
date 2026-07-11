package com.healthcare.backend.staff.dto;

import com.healthcare.backend.common.enums.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class StaffRequestDto {

    @NotBlank(message = "First name is required")
    private String firstName;

    private String lastName;

    @Email(message = "Invalid email format")
    private String email;

    private String phone;

    @NotBlank(message = "Employee number is required")
    private String employeeNumber;

    // Only required on create; leave blank on update to keep the existing password
    private String password;

    @NotNull(message = "Role is required")
    private UserRole role;

    private Boolean active;

    private UUID departmentId;

    private UUID doctorId;
}