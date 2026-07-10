package com.healthcare.backend.emr.entity;


import com.healthcare.backend.common.base.BaseEntity;

import jakarta.persistence.*;
import lombok.*;


@Entity
@Table(name="vitals")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Vitals extends BaseEntity {


    private Double temperature;


    private Integer heartRate;


    private Integer bloodPressure;


    private Double weight;


    private Double height;



    @OneToOne
    @JoinColumn(name="medical_record_id")
    private MedicalRecord medicalRecord;

}