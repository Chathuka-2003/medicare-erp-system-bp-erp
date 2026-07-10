package com.healthcare.backend.ward.entity;

import com.healthcare.backend.common.base.BaseEntity;
import com.healthcare.backend.ward.enums.BedStatus;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "beds")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Bed extends BaseEntity {

    @Column(nullable = false)
    private String bedNumber;

    @Enumerated(EnumType.STRING)
    private BedStatus status;

    private String roomNumber;

    @ManyToOne
    @JoinColumn(name = "ward_id")
    private Ward ward;

    @OneToOne(mappedBy = "bed")
    private Admission admission;

}