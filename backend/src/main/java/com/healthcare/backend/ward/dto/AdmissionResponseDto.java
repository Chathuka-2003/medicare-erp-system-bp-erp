package com.healthcare.backend.ward.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdmissionResponseDto {

    private UUID id;
    private String admissionNumber;
    private LocalDateTime admissionDate;
    private LocalDateTime dischargeDate;
    private String diagnosis;
    private String remarks;

    private UUID patientId;
    private String patientName;

    private UUID doctorId;
    private String doctorName;

    private UUID bedId;
    private String bedNumber;
    private String wardName;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
