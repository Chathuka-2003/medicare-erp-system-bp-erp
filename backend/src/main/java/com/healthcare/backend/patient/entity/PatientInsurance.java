package com.healthcare.backend.patient.entity;


import com.healthcare.backend.common.base.BaseEntity;
import jakarta.persistence.*;
import lombok.*;


@Entity
@Table(name="patient_insurance")
@Getter
@Setter
public class PatientInsurance extends BaseEntity {


    private String providerName;


    private String policyNumber;


    private String coverageType;


    @OneToOne
    @JoinColumn(name="patient_id")
    private Patient patient;

}