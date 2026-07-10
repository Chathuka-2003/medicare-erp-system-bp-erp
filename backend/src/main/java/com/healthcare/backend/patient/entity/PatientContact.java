package com.healthcare.backend.patient.entity;


import com.healthcare.backend.common.base.BaseEntity;
import jakarta.persistence.*;
import lombok.*;


@Entity
@Table(name="patient_contacts")
@Getter
@Setter
public class PatientContact extends BaseEntity {


    private String contactType;


    private String contactValue;


    @ManyToOne
    @JoinColumn(name="patient_id")
    private Patient patient;

}