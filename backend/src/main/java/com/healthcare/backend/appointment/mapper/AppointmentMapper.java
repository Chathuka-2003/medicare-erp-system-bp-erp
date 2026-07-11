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

        if (appointment.getDoctor() != null) {
            builder.doctorId(appointment.getDoctor().getId());
            builder.doctorName(buildDoctorName(appointment.getDoctor()));
        }

        return builder.build();
    }

    private String buildPatientName(Patient patient) {
        String first = patient.getFirstName() != null ? patient.getFirstName() : "";
        String last = patient.getLastName() != null ? patient.getLastName() : "";
        return (first + " " + last).trim();
    }

    private String buildDoctorName(Doctor doctor) {
        // Adjust getter names here once the Doctor entity from the staff module is finalized
        try {
            return doctor.toString();
        } catch (Exception e) {
            return null;
        }
    }
}