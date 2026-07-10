package com.healthcare.backend.staff.entity;


import com.healthcare.backend.common.base.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;


@Entity
@Table(name = "doctors")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Doctor extends BaseEntity {


    @Column(nullable = false)
    private String firstName;


    private String lastName;


    @Column(unique = true)
    private String licenseNumber;


    private String email;


    private String phone;



    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department department;



    @ManyToOne
    @JoinColumn(name = "specialization_id")
    private Specialization specialization;



    @OneToMany(
            mappedBy = "doctor",
            cascade = CascadeType.ALL
    )
    private List<Staff> staffMembers;

}