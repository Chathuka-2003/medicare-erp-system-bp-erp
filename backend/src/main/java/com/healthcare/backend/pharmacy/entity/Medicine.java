package com.healthcare.backend.pharmacy.entity;

import com.healthcare.backend.common.base.BaseEntity;
import com.healthcare.backend.pharmacy.enums.MedicineCategory;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "medicines")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Medicine extends BaseEntity {

    @Column(nullable = false, unique = true)
    private String medicineCode;

    @Column(nullable = false)
    private String medicineName;

    private String genericName;

    private String manufacturer;


    @Enumerated(EnumType.STRING)
    private MedicineCategory category;

    
    private String dosageForm;

    private String strength;

    @Column(precision = 10, scale = 2)
    private BigDecimal unitPrice;

    @OneToMany(mappedBy = "medicine", cascade = CascadeType.ALL)
    private List<MedicineStock> stocks;

}