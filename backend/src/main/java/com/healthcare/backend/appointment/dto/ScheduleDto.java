package com.healthcare.backend.appointment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class ScheduleDto {

    private UUID id;

    @NotNull(message = "Doctor is required")
    private UUID doctorId;

    @NotBlank(message = "Day is required")
    private String day;

    @NotBlank(message = "Start time is required")
    private String startTime;

    @NotBlank(message = "End time is required")
    private String endTime;
}