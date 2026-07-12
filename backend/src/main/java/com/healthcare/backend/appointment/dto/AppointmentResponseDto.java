package com.healthcare.backend.appointment.dto;

import com.healthcare.backend.appointment.enums.AppointmentStatus;
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
public class AppointmentResponseDto {

    private UUID id;
    private LocalDateTime appointmentDate;
    private String reason;
    private String notes;
    private AppointmentStatus status;

    private UUID patientId;
    private String patientName;

    private UUID doctorId;
    private String doctorName;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}