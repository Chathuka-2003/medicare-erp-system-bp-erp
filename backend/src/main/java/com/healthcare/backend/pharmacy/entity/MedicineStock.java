package com.healthcare.backend.pharmacy.entity;

import com.healthcare.backend.common.base.BaseEntity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "medicine_stock")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MedicineStock extends BaseEntity {


    @ManyToOne
    @JoinColumn(name = "medicine_id")
    private Medicine medicine;

    
    @Column(nullable = false)
    private String batchNumber;

    private Integer quantityInStock;

    private Integer reorderLevel;

    private LocalDate manufactureDate;

    private LocalDate expiryDate;

    private String storageLocation;

}