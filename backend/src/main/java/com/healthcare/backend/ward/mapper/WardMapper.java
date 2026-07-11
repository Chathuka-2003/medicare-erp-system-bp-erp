package com.healthcare.backend.ward.mapper;

import com.healthcare.backend.ward.dto.*;
import com.healthcare.backend.ward.entity.Admission;
import com.healthcare.backend.ward.entity.Bed;
import com.healthcare.backend.ward.entity.Ward;
import org.springframework.stereotype.Component;

@Component
public class WardMapper {

    public WardResponseDto toResponseDto(Ward ward) {
        return WardResponseDto.builder()
                .id(ward.getId())
                .wardCode(ward.getWardCode())
                .wardName(ward.getWardName())
                .wardType(ward.getWardType())
                .totalBeds(ward.getTotalBeds())
                .availableBeds(ward.getAvailableBeds())
                .floor(ward.getFloor())
                .description(ward.getDescription())
                .createdAt(ward.getCreatedAt())
                .updatedAt(ward.getUpdatedAt())
                .build();
    }

    public BedResponseDto toResponseDto(Bed bed) {
        BedResponseDto.BedResponseDtoBuilder builder = BedResponseDto.builder()
                .id(bed.getId())
                .bedNumber(bed.getBedNumber())
                .status(bed.getStatus())
                .roomNumber(bed.getRoomNumber())
                .createdAt(bed.getCreatedAt())
                .updatedAt(bed.getUpdatedAt());

        if (bed.getWard() != null) {
            builder.wardId(bed.getWard().getId());
            builder.wardName(bed.getWard().getWardName());
        }

        return builder.build();
    }

    public AdmissionResponseDto toResponseDto(Admission admission) {
        AdmissionResponseDto.AdmissionResponseDtoBuilder builder = AdmissionResponseDto.builder()
                .id(admission.getId())
                .admissionNumber(admission.getAdmissionNumber())
                .admissionDate(admission.getAdmissionDate())
                .dischargeDate(admission.getDischargeDate())
                .diagnosis(admission.getDiagnosis())
                .remarks(admission.getRemarks())
                .createdAt(admission.getCreatedAt())
                .updatedAt(admission.getUpdatedAt());

        if (admission.getPatient() != null) {
            builder.patientId(admission.getPatient().getId());
            builder.patientName((admission.getPatient().getFirstName() + " " +
                    (admission.getPatient().getLastName() != null ? admission.getPatient().getLastName() : "")).trim());
        }

        if (admission.getDoctor() != null) {
            builder.doctorId(admission.getDoctor().getId());
            builder.doctorName((admission.getDoctor().getFirstName() + " " +
                    (admission.getDoctor().getLastName() != null ? admission.getDoctor().getLastName() : "")).trim());
        }

        if (admission.getBed() != null) {
            builder.bedId(admission.getBed().getId());
            builder.bedNumber(admission.getBed().getBedNumber());
            if (admission.getBed().getWard() != null) {
                builder.wardName(admission.getBed().getWard().getWardName());
            }
        }

        return builder.build();
    }
}
