package com.healthcare.backend.patient.entity;


import com.healthcare.backend.common.base.BaseEntity;
import jakarta.persistence.*;
import lombok.*;


@Entity
@Table(name="next_of_kin")
@Getter
@Setter
public class NextOfKin extends BaseEntity {


    private String name;


    private String relationship;


    private String phone;


    private String address;


    @OneToOne
    @JoinColumn(name="patient_id")
    private Patient patient;

}