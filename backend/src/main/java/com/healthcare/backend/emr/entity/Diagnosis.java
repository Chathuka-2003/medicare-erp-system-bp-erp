package com.healthcare.backend.emr.entity;


import com.healthcare.backend.common.base.BaseEntity;

import jakarta.persistence.*;
import lombok.*;


@Entity
@Table(name="diagnosis")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Diagnosis extends BaseEntity {

    private String diagnosisName;
    private String description;
    private String severity;
    @ManyToOne
    @JoinColumn(name="medical_record_id")
    private MedicalRecord medicalRecord;

}