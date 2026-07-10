package com.healthcare.backend.patient.entity;


import com.healthcare.backend.common.base.BaseEntity;
import com.healthcare.backend.common.enums.BloodGroup;
import com.healthcare.backend.common.enums.Gender;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;


@Entity
@Table(name="patients")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Patient extends BaseEntity {


    @Column(nullable=false)
    private String firstName;

    @Column(unique = true, nullable = false)
    private String patientNumber;

    private String lastName;


    private LocalDate dateOfBirth;


    @Enumerated(EnumType.STRING)
    private Gender gender;


    @Enumerated(EnumType.STRING)
    private BloodGroup bloodGroup;


    private String nic;


    private String email;


    private String phone;


    private String emergencyContact;


    @OneToOne(
            mappedBy="patient",
            cascade=CascadeType.ALL
    )
    private PatientAddress address;



    @OneToOne(
            mappedBy="patient",
            cascade=CascadeType.ALL
    )
    private PatientInsurance insurance;



    @OneToOne(
            mappedBy="patient",
            cascade=CascadeType.ALL
    )
    private NextOfKin nextOfKin;

}