package com.healthcare.backend.ward.entity;

import com.healthcare.backend.common.base.BaseEntity;
import com.healthcare.backend.ward.enums.WardType;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "wards")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Ward extends BaseEntity {

    @Column(nullable = false, unique = true)
    private String wardCode;

    @Column(nullable = false)
    private String wardName;

    @Enumerated(EnumType.STRING)
    private WardType wardType;

    private Integer totalBeds;

    private Integer availableBeds;

    private String floor;

    private String description;

    @OneToMany(mappedBy = "ward", cascade = CascadeType.ALL)
    private List<Bed> beds;

}