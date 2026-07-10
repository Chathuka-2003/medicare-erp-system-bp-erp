package com.healthcare.backend.laboratory.entity;

import com.healthcare.backend.common.base.BaseEntity;
import com.healthcare.backend.staff.entity.Staff;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "lab_results")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LabResult extends BaseEntity {

    @OneToOne
    @JoinColumn(name = "lab_order_item_id")
    private LabOrderItem labOrderItem;

    @Column(length = 3000)
    private String resultValue;

    private String remarks;

    private LocalDateTime completedDate;

    @ManyToOne
    @JoinColumn(name = "verified_by")
    private Staff verifiedBy;

}