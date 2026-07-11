package com.healthcare.backend.patient.entity;


import com.healthcare.backend.common.base.BaseEntity;
import jakarta.persistence.*;
import lombok.*;


@Entity
@Table(name="patient_addresses")
@Getter
@Setter
public class PatientAddress extends BaseEntity {

    private String street;


    private String city;


    private String district;


    private String postalCode;

    @OneToOne
    @JoinColumn(name="patient_id")
    private Patient patient;

}