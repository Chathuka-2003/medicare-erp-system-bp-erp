package com.healthcare.backend.appointment.entity;


import com.healthcare.backend.common.base.BaseEntity;
import jakarta.persistence.*;
import lombok.*;


@Entity
@Table(name="time_slots")
@Getter
@Setter
public class TimeSlot extends BaseEntity {

    private String startTime;
    private String endTime;
    private boolean available;
    @ManyToOne
    private DoctorSchedule schedule;

}