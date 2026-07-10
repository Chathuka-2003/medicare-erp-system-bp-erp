package com.healthcare.backend.laboratory.entity;

import com.healthcare.backend.common.base.BaseEntity;
import com.healthcare.backend.laboratory.enums.LabTestStatus;
import com.healthcare.backend.patient.entity.Patient;
import com.healthcare.backend.staff.entity.Doctor;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "lab_orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LabOrder extends BaseEntity {

    @Column(nullable = false, unique = true)
    private String orderNumber;

    private LocalDateTime orderDate;

    @ManyToOne
    @JoinColumn(name = "patient_id")
    private Patient patient;

    @ManyToOne
    @JoinColumn(name = "doctor_id")
    private Doctor doctor;

    @Enumerated(EnumType.STRING)
    private LabTestStatus status;

    @OneToMany(mappedBy = "labOrder", cascade = CascadeType.ALL)
    private List<LabOrderItem> orderItems;

}