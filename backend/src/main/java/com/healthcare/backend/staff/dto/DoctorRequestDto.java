package com.healthcare.backend.staff.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class DoctorRequestDto {

    @NotBlank(message = "First name is required")
    private String firstName;

    private String lastName;

    @NotBlank(message = "License number is required")
    private String licenseNumber;

    @Email(message = "Invalid email format")
    private String email;

    private String phone;

    @NotNull(message = "Department is required")
    private UUID departmentId;

    private UUID specializationId;
}