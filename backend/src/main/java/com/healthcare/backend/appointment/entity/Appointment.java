package com.healthcare.backend.appointment.entity;


import com.healthcare.backend.appointment.enums.AppointmentStatus;
import com.healthcare.backend.common.base.BaseEntity;
import com.healthcare.backend.patient.entity.Patient;
import com.healthcare.backend.staff.entity.Doctor;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;


@Entity
@Table(name="appointments")
@Getter
@Setter
public class Appointment extends BaseEntity {

    private LocalDateTime appointmentDate;
    private String reason;
    private String notes;
    @Enumerated(EnumType.STRING)
    private AppointmentStatus status;
    @ManyToOne
    @JoinColumn(name="patient_id")
    private Patient patient;
    @ManyToOne
    @JoinColumn(name="doctor_id")
    private Doctor doctor;

}