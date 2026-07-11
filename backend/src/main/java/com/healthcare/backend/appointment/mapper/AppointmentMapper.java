package com.healthcare.backend.appointment.mapper;

import com.healthcare.backend.appointment.dto.AppointmentRequestDto;
import com.healthcare.backend.appointment.dto.AppointmentResponseDto;
import com.healthcare.backend.appointment.entity.Appointment;
import com.healthcare.backend.appointment.enums.AppointmentStatus;
import com.healthcare.backend.patient.entity.Patient;
import com.healthcare.backend.staff.entity.Doctor;
import org.springframework.stereotype.Component;

@Component
public class AppointmentMapper {

    public Appointment toEntity(AppointmentRequestDto dto, Patient patient, Doctor doctor) {
        Appointment appointment = new Appointment();
        applyToEntity(appointment, dto, patient, doctor);
        return appointment;
    }

    public void applyToEntity(Appointment appointment, AppointmentRequestDto dto, Patient patient, Doctor doctor) {
        appointment.setAppointmentDate(dto.getAppointmentDate());
        appointment.setReason(dto.getReason());
        appointment.setNotes(dto.getNotes());
        appointment.setStatus(dto.getStatus() != null ? dto.getStatus() : AppointmentStatus.SCHEDULED);
        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
    }

    public AppointmentResponseDto toResponseDto(Appointment appointment) {
        AppointmentResponseDto.AppointmentResponseDtoBuilder builder = AppointmentResponseDto.builder()
                .id(appointment.getId())
                .appointmentDate(appointment.getAppointmentDate())
                .reason(appointment.getReason())
                .notes(appointment.getNotes())
                .status(appointment.getStatus())
                .createdAt(appointment.getCreatedAt())
                .updatedAt(appointment.getUpdatedAt());

        if (appointment.getPatient() != null) {
            builder.patientId(appointment.getPatient().getId());
            builder.patientName(buildPatientName(appointment.getPatient()));
        }