package com.healthcare.backend.patient.dto;

import com.healthcare.backend.common.enums.BloodGroup;
import com.healthcare.backend.common.enums.Gender;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PatientResponseDto {

    private UUID id;
    private String patientNumber;
    private String firstName;
    private String lastName;
    private LocalDate dateOfBirth;
    private Integer age;
    private Gender gender;
    private BloodGroup bloodGroup;
    private String nic;
    private String email;
    private String phone;
    private String emergencyContact;

    private AddressDto address;
    private InsuranceDto insurance;
    private NextOfKinDto nextOfKin;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AddressDto {
        private String street;
        private String city;
        private String district;
        private String postalCode;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class InsuranceDto {
        private String providerName;
        private String policyNumber;
        private String coverageType;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class NextOfKinDto {
        private String name;
        private String relationship;
        private String phone;
        private String address;
    }
}