package com.healthcare.backend.appointment.repository;

import com.healthcare.backend.appointment.entity.Appointment;
import com.healthcare.backend.appointment.enums.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface AppointmentRepository extends JpaRepository<Appointment, UUID>, JpaSpecificationExecutor<Appointment> {

    List<Appointment> findByPatientId(UUID patientId);

    List<Appointment> findByDoctorId(UUID doctorId);

    List<Appointment> findByStatus(AppointmentStatus status);

    List<Appointment> findByDoctorIdAndAppointmentDateBetween(
            UUID doctorId, LocalDateTime start, LocalDateTime end);

    boolean existsByDoctorIdAndAppointmentDate(UUID doctorId, LocalDateTime appointmentDate);
}


