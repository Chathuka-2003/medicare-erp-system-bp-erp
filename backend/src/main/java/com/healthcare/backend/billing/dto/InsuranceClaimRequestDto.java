package com.healthcare.backend.billing.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;
//import lombok.Setter;

@Getter
@Setter
public class InsuranceClaimRequestDto {

    @NotNull(message = "Patient is required")
    private UUID patientId;

    private UUID invoiceId;

    @NotBlank(message = "Insurance provider is required")
    private String insuranceProvider;

    @NotNull(message = "Claim amount is required")
    private BigDecimal claimAmount;

    private BigDecimal approvedAmount;

    @NotNull(message = "Claim date is required")
    private LocalDate claimDate;

    private LocalDate settlementDate;

    private String status;
}