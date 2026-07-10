package com.healthcare.backend.inventory.entity;

import com.healthcare.backend.common.base.BaseEntity;
import com.healthcare.backend.inventory.enums.ItemCategory;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Item extends BaseEntity {

    @Column(nullable = false, unique = true)
    private String itemCode;

    @Column(nullable = false)
    private String itemName;

    @Enumerated(EnumType.STRING)
    private ItemCategory category;

    private String unit;

    private Integer quantityInStock;

    private Integer reorderLevel;

    @Column(precision = 12, scale = 2)
    private BigDecimal purchasePrice;

    @Column(precision = 12, scale = 2)
    private BigDecimal sellingPrice;

    private String storageLocation;

    @ManyToOne
    @JoinColumn(name = "supplier_id")
    private Supplier supplier;

    @OneToMany(mappedBy = "item", cascade = CascadeType.ALL)
    private List<StockMovement> stockMovements;

}