package com.healthcare.backend.appointment.service;

import com.healthcare.backend.appointment.dto.AppointmentRequestDto;
import com.healthcare.backend.appointment.dto.AppointmentResponseDto;
import com.healthcare.backend.appointment.enums.AppointmentStatus;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.UUID;

public interface AppointmentService {

    AppointmentResponseDto createAppointment(AppointmentRequestDto requestDto);

    AppointmentResponseDto getAppointmentById(UUID id);

    Page<AppointmentResponseDto> getAllAppointments(int page, int size, String sortBy, String sortDirection);

    List<AppointmentResponseDto> getAppointmentsByPatient(UUID patientId);

    List<AppointmentResponseDto> getAppointmentsByDoctor(UUID doctorId);
