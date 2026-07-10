package com.healthcare.backend.patient.dto;

import com.healthcare.backend.common.enums.BloodGroup;
import com.healthcare.backend.common.enums.Gender;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class PatientRequestDto {

    @NotBlank(message = "First name is required")
    private String firstName;

    private String lastName;

    @NotNull(message = "Date of birth is required")
    @Past(message = "Date of birth must be in the past")
    private LocalDate dateOfBirth;

    private Gender gender;

    private BloodGroup bloodGroup;

    @Pattern(regexp = "^([0-9]{9}[vVxX]|[0-9]{12})$", message = "Invalid NIC format")
    private String nic;

    @Email(message = "Invalid email format")
    private String email;

    @Pattern(regexp = "^[0-9+ -]{7,15}$", message = "Invalid phone number")
    private String phone;

    private String emergencyContact;

    private AddressDto address;

    private InsuranceDto insurance;

    private NextOfKinDto nextOfKin;

    @Getter
    @Setter
    public static class AddressDto {
        private String street;
        private String city;
        private String district;
        private String postalCode;
    }

    @Getter
    @Setter
    public static class InsuranceDto {
        private String providerName;
        private String policyNumber;
        private String coverageType;
    }

    @Getter
    @Setter
    public static class NextOfKinDto {
        @NotBlank(message = "Next of kin name is required")
        private String name;
        private String relationship;
        private String phone;
        private String address;
    }
}