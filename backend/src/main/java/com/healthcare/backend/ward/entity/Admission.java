package com.healthcare.backend.ward.entity;

import com.healthcare.backend.common.base.BaseEntity;
import com.healthcare.backend.patient.entity.Patient;
import com.healthcare.backend.staff.entity.Doctor;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "admissions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Admission extends BaseEntity {

    @Column(nullable = false, unique = true)
    private String admissionNumber;

    private LocalDateTime admissionDate;

    private LocalDateTime dischargeDate;

    private String diagnosis;

    private String remarks;

    @ManyToOne
    @JoinColumn(name = "patient_id")
    private Patient patient;

    @ManyToOne
    @JoinColumn(name = "doctor_id")
    private Doctor doctor;

    @OneToOne
    @JoinColumn(name = "bed_id")
    private Bed bed;

}