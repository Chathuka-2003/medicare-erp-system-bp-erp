package com.healthcare.backend.appointment.repository;

import com.healthcare.backend.appointment.entity.DoctorSchedule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ScheduleRepository extends JpaRepository<DoctorSchedule, UUID> {


}