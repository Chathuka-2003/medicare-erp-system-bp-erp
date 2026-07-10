package com.healthcare.backend.laboratory.entity;

import com.healthcare.backend.common.base.BaseEntity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "lab_order_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LabOrderItem extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "lab_order_id")
    private LabOrder labOrder;

    @ManyToOne
    @JoinColumn(name = "lab_test_id")
    private LabTest labTest;

    @OneToOne(mappedBy = "labOrderItem", cascade = CascadeType.ALL)
    private LabResult labResult;

}