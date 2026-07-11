package com.healthcare.backend.appointment.dto;

import com.healthcare.backend.appointment.enums.AppointmentStatus;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
public class AppointmentRequestDto {

    @NotNull(message = "Patient is required")
    private UUID patientId;