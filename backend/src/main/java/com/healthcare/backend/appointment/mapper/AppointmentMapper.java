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