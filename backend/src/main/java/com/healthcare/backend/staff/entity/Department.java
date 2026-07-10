package com.healthcare.backend.staff.entity;


import com.healthcare.backend.common.base.BaseEntity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;


@Entity
@Table(name="departments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Department extends BaseEntity {


    @Column(nullable=false)
    private String name;


    private String description;



    @OneToMany(
            mappedBy="department",
            cascade=CascadeType.ALL
    )
    private List<Doctor> doctors;



    @OneToMany(
            mappedBy="department",
            cascade=CascadeType.ALL
    )
    private List<Staff> staff;

}