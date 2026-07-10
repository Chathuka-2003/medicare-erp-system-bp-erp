package com.healthcare.backend.appointment.entity;


import com.healthcare.backend.common.base.BaseEntity;
import com.healthcare.backend.staff.entity.Doctor;

import jakarta.persistence.*;
import lombok.*;


@Entity
@Table(name="doctor_schedule")
@Getter
@Setter
public class DoctorSchedule extends BaseEntity {

    private String day;
    private String startTime;
    private String endTime;
    @ManyToOne
    @JoinColumn(name="doctor_id")
    private Doctor doctor;

}