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

    @NotNull(message = "Doctor is required")
    private UUID doctorId;

    @NotNull(message = "Appointment date is required")
    @Future(message = "Appointment date must be in the future")
    private LocalDateTime appointmentDate;

    private String reason;

    private String notes;

    private AppointmentStatus status;
}