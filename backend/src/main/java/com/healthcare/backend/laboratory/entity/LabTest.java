package com.healthcare.backend.laboratory.entity;

import com.healthcare.backend.common.base.BaseEntity;

import com.healthcare.backend.laboratory.enums.LabTestCategory;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "lab_tests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LabTest extends BaseEntity {

    @Column(nullable = false, unique = true)
    private String testCode;

    @Column(nullable = false)
    private String testName;

    @Convert(converter = com.healthcare.backend.laboratory.converter.LabTestCategoryConverter.class)
    private LabTestCategory category;

    @Column(length = 1000)
    private String description;

    @Column(precision = 10, scale = 2)
    private BigDecimal price;

    private String sampleType;

    private String normalRange;

    @OneToMany(mappedBy = "labTest", cascade = CascadeType.ALL)
    private List<LabOrderItem> orderItems;

}
