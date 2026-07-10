package com.healthcare.backend.staff.entity;


import com.healthcare.backend.common.base.BaseEntity;
import com.healthcare.backend.common.enums.UserRole;

import jakarta.persistence.*;
import lombok.*;


@Entity
@Table(name = "staff")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Staff extends BaseEntity {


    @Column(nullable = false)
    private String firstName;


    private String lastName;


    private String email;


    private String phone;


    private String employeeNumber;


    private String password;



    @Enumerated(EnumType.STRING)
    private UserRole role;



    private boolean active = true;



    @ManyToOne
    @JoinColumn(name="department_id")
    private Department department;



    @ManyToOne
    @JoinColumn(name="doctor_id")
    private Doctor doctor;

}