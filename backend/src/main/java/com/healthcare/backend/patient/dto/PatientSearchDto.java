package com.healthcare.backend.patient.dto;

import com.healthcare.backend.common.enums.BloodGroup;
import com.healthcare.backend.common.enums.Gender;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class PatientSearchDto {
    private String patientNumber;
    private String firstName;
    private String lastName;
    private String nic;
    private String phone;
    private String email;
    private Gender gender;
    private BloodGroup bloodGroup;
    private LocalDate dobFrom;
    private LocalDate dobTo;

    // pagination
    private int page = 0;
    private int size = 10;
    private String sortBy = "id";
    private String sortDirection = "ASC";
}