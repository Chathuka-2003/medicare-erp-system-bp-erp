package com.healthcare.backend.billing.entity;

import com.healthcare.backend.common.base.BaseEntity;
import com.healthcare.backend.patient.entity.Patient;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "insurance_claims")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class InsuranceClaim extends BaseEntity {

    @Column(nullable = false)
    private String claimNumber;

    private String insuranceProvider;

    @Column(precision = 12, scale = 2)
    private BigDecimal claimAmount;

    @Column(precision = 12, scale = 2)
    private BigDecimal approvedAmount;

    private LocalDate claimDate;

    private LocalDate settlementDate;

    private String status;

    @ManyToOne
    @JoinColumn(name = "patient_id")
    private Patient patient;

    @OneToOne
    @JoinColumn(name = "invoice_id")
    private Invoice invoice;

}