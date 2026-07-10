package com.healthcare.backend.billing.entity;

import com.healthcare.backend.common.base.BaseEntity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "invoice_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class InvoiceItem extends BaseEntity {

    private String itemName;

    private Integer quantity;

    @Column(precision = 12, scale = 2)
    private BigDecimal unitPrice;

    @Column(precision = 12, scale = 2)
    private BigDecimal totalPrice;

    @ManyToOne
    @JoinColumn(name = "invoice_id")
    private Invoice invoice;

}