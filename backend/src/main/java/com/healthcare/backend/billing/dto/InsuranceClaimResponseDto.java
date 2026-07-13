package com.healthcare.backend.billing.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;
//import java.math.BigDecimal;


@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InsuranceClaimResponseDto {

 private UUID id;
    private String claimNumber;
    private String insuranceProvider;
    private BigDecimal claimAmount;
    private BigDecimal approvedAmount;
    private LocalDate claimDate;
    private LocalDate settlementDate;
    private String status;

    private UUID patientId;
    private String patientName;

    private UUID invoiceId;
    private String invoiceNumber;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}