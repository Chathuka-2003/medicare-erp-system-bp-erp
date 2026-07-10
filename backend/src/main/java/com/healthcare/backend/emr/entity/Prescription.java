package com.healthcare.backend.emr.entity;


import com.healthcare.backend.common.base.BaseEntity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;


@Entity
@Table(name="prescriptions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Prescription extends BaseEntity {


    private String notes;



    @OneToOne
    @JoinColumn(name="medical_record_id")
    private MedicalRecord medicalRecord;



    @OneToMany(
            mappedBy="prescription",
            cascade=CascadeType.ALL
    )
    private List<PrescriptionItem> items;

}