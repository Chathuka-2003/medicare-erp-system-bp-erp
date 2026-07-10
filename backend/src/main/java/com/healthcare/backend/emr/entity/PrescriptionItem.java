package com.healthcare.backend.emr.entity;


import com.healthcare.backend.common.base.BaseEntity;

import jakarta.persistence.*;
import lombok.*;


@Entity
@Table(name="prescription_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PrescriptionItem extends BaseEntity {


    private String medicineName;


    private String dosage;


    private String frequency;


    private Integer duration;



    @ManyToOne
    @JoinColumn(name="prescription_id")
    private Prescription prescription;

}