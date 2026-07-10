package com.healthcare.backend.staff.entity;


import com.healthcare.backend.common.base.BaseEntity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;


@Entity
@Table(name="specializations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Specialization extends BaseEntity {


    @Column(nullable=false)
    private String name;


    private String description;



    @OneToMany(
            mappedBy="specialization",
            cascade=CascadeType.ALL
    )
    private List<Doctor> doctors;

}