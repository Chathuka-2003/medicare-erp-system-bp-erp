package com.healthcare.backend.patient.mapper;

import com.healthcare.backend.patient.dto.PatientRequestDto;
import com.healthcare.backend.patient.dto.PatientResponseDto;
import com.healthcare.backend.patient.entity.NextOfKin;
import com.healthcare.backend.patient.entity.Patient;
import com.healthcare.backend.patient.entity.PatientAddress;
import com.healthcare.backend.patient.entity.PatientInsurance;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.Period;

@Component
public class PatientMapper {

    public Patient toEntity(PatientRequestDto dto) {
        Patient patient = new Patient();
        applyToEntity(patient, dto);
        return patient;
    }

    public void applyToEntity(Patient patient, PatientRequestDto dto) {
        patient.setFirstName(dto.getFirstName());
        patient.setLastName(dto.getLastName());
        patient.setDateOfBirth(dto.getDateOfBirth());
        patient.setGender(dto.getGender());
        patient.setBloodGroup(dto.getBloodGroup());
        patient.setNic(dto.getNic());
        patient.setEmail(dto.getEmail());
        patient.setPhone(dto.getPhone());
        patient.setEmergencyContact(dto.getEmergencyContact());

        if (dto.getAddress() != null) {
            PatientAddress address = patient.getAddress() != null ? patient.getAddress() : new PatientAddress();
            address.setStreet(dto.getAddress().getStreet());
            address.setCity(dto.getAddress().getCity());
            address.setDistrict(dto.getAddress().getDistrict());
            address.setPostalCode(dto.getAddress().getPostalCode());
            address.setPatient(patient);
            patient.setAddress(address);
        }

        if (dto.getInsurance() != null) {
            PatientInsurance insurance = patient.getInsurance() != null ? patient.getInsurance() : new PatientInsurance();
            insurance.setProviderName(dto.getInsurance().getProviderName());
            insurance.setPolicyNumber(dto.getInsurance().getPolicyNumber());
            insurance.setCoverageType(dto.getInsurance().getCoverageType());
            insurance.setPatient(patient);
            patient.setInsurance(insurance);
        }

        if (dto.getNextOfKin() != null) {
            NextOfKin nok = patient.getNextOfKin() != null ? patient.getNextOfKin() : new NextOfKin();
            nok.setName(dto.getNextOfKin().getName());
            nok.setRelationship(dto.getNextOfKin().getRelationship());
            nok.setPhone(dto.getNextOfKin().getPhone());
            nok.setAddress(dto.getNextOfKin().getAddress());
            nok.setPatient(patient);
            patient.setNextOfKin(nok);
        }
    }

    public PatientResponseDto toResponseDto(Patient patient) {
        PatientResponseDto.PatientResponseDtoBuilder builder = PatientResponseDto.builder()
                .id(patient.getId())
                .patientNumber(patient.getPatientNumber())
                .firstName(patient.getFirstName())
                .lastName(patient.getLastName())
                .dateOfBirth(patient.getDateOfBirth())
                .age(calculateAge(patient.getDateOfBirth()))
                .gender(patient.getGender())
                .bloodGroup(patient.getBloodGroup())
                .nic(patient.getNic())
                .email(patient.getEmail())
                .phone(patient.getPhone())
                .emergencyContact(patient.getEmergencyContact());

        if (patient.getAddress() != null) {
            builder.address(PatientResponseDto.AddressDto.builder()
                    .street(patient.getAddress().getStreet())
                    .city(patient.getAddress().getCity())
                    .district(patient.getAddress().getDistrict())
                    .postalCode(patient.getAddress().getPostalCode())
                    .build());
        }

        if (patient.getInsurance() != null) {
            builder.insurance(PatientResponseDto.InsuranceDto.builder()
                    .providerName(patient.getInsurance().getProviderName())
                    .policyNumber(patient.getInsurance().getPolicyNumber())
                    .coverageType(patient.getInsurance().getCoverageType())
                    .build());
        }

        if (patient.getNextOfKin() != null) {
            builder.nextOfKin(PatientResponseDto.NextOfKinDto.builder()
                    .name(patient.getNextOfKin().getName())
                    .relationship(patient.getNextOfKin().getRelationship())
                    .phone(patient.getNextOfKin().getPhone())
                    .address(patient.getNextOfKin().getAddress())
                    .build());
        }

        return builder.build();
    }

    private Integer calculateAge(LocalDate dob) {
        if (dob == null) return null;
        return Period.between(dob, LocalDate.now()).getYears();
    }
}