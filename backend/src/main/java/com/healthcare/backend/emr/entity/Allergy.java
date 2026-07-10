package com.healthcare.backend.emr.entity;


import com.healthcare.backend.common.base.BaseEntity;
import com.healthcare.backend.patient.entity.Patient;

import jakarta.persistence.*;
import lombok.*;


@Entity
@Table(name="allergies")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Allergy extends BaseEntity {

    private String allergyName;
    private String description;
    private String severity;
    @ManyToOne
    @JoinColumn(name="patient_id")
    private Patient patient;

}