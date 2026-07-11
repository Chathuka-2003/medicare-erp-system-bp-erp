package com.healthcare.backend.billing.dto;

import com.healthcare.backend.billing.enums.PaymentMethod;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponseDto {

 private UUID id;
    private String paymentReference;
    private BigDecimal amount;
    private LocalDateTime paymentDate;
    private PaymentMethod paymentMethod;
    private String remarks;

    private UUID invoiceId;
    private String invoiceNumber;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}