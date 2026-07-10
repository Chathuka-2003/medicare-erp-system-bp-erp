package com.healthcare.backend.emr.entity;


import com.healthcare.backend.common.base.BaseEntity;
import com.healthcare.backend.emr.enums.RecordType;
import com.healthcare.backend.patient.entity.Patient;
import com.healthcare.backend.staff.entity.Doctor;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;


@Entity
@Table(name="medical_records")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MedicalRecord extends BaseEntity {


    private LocalDate recordDate;
    private String description;

    @Enumerated(EnumType.STRING)
    private RecordType recordType;

    @ManyToOne
    @JoinColumn(name="patient_id")
    private Patient patient;
    @ManyToOne
    @JoinColumn(name="doctor_id")
    private Doctor doctor;



    @OneToOne(
            mappedBy="medicalRecord",
            cascade=CascadeType.ALL
    )
    private Vitals vitals;



    @OneToMany(
            mappedBy="medicalRecord",
            cascade=CascadeType.ALL
    )
    private List<Diagnosis> diagnoses;



    @OneToOne(
            mappedBy="medicalRecord",
            cascade=CascadeType.ALL
    )
    private Prescription prescription;

}