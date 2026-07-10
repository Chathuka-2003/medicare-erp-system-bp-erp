package com.healthcare.backend.billing.entity;

import com.healthcare.backend.billing.enums.PaymentMethod;
import com.healthcare.backend.common.base.BaseEntity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Payment extends BaseEntity {

    @Column(nullable = false)
    private String paymentReference;

    @Column(precision = 12, scale = 2)
    private BigDecimal amount;

    private LocalDateTime paymentDate;

    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod;

    private String remarks;

    @ManyToOne
    @JoinColumn(name = "invoice_id")
    private Invoice invoice;

}