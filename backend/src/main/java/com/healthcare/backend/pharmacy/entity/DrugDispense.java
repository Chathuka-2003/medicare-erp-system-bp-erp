package com.healthcare.backend.pharmacy.entity;

import com.healthcare.backend.common.base.BaseEntity;
import com.healthcare.backend.patient.entity.Patient;
import com.healthcare.backend.emr.entity.Prescription;
import com.healthcare.backend.staff.entity.Staff;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "drug_dispense")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DrugDispense extends BaseEntity {

    @Column(nullable = false)
    private String dispenseNumber;

    private LocalDateTime dispenseDate;

    private String remarks;

    @ManyToOne
    @JoinColumn(name = "patient_id")
    private Patient patient;

    @OneToOne
    @JoinColumn(name = "prescription_id")
    private Prescription prescription;

    @ManyToOne
    @JoinColumn(name = "dispensed_by")
    private Staff pharmacist;

    @OneToMany(mappedBy = "drugDispense", cascade = CascadeType.ALL)
    private List<DrugDispenseItem> items;

}