package com.healthcare.backend.inventory.entity;

import com.healthcare.backend.common.base.BaseEntity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "stock_movements")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StockMovement extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "item_id")
    private Item item;

    private Integer quantity;

    private String movementType;

    private String referenceNumber;

    private String remarks;

    private LocalDateTime movementDate;

}
