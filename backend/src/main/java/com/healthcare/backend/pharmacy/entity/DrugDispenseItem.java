package com.healthcare.backend.pharmacy.entity;

import com.healthcare.backend.common.base.BaseEntity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "drug_dispense_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DrugDispenseItem extends BaseEntity {


    @ManyToOne
    @JoinColumn(name = "drug_dispense_id")
    private DrugDispense drugDispense;

    
    @ManyToOne
    @JoinColumn(name = "medicine_id")
    private Medicine medicine;

    private Integer quantity;

    private String dosage;

    private String instructions;

}