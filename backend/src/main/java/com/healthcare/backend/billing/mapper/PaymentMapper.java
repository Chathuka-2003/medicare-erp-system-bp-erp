package com.healthcare.backend.billing.mapper;

import com.healthcare.backend.billing.dto.PaymentResponseDto;
import com.healthcare.backend.billing.entity.Payment;
import org.springframework.stereotype.Component;

@Component
public class PaymentMapper {

    public PaymentResponseDto toResponseDto(Payment payment) {
        PaymentResponseDto.PaymentResponseDtoBuilder builder = PaymentResponseDto.builder()
                .id(payment.getId())
                .paymentReference(payment.getPaymentReference())
                .amount(payment.getAmount())
                .paymentDate(payment.getPaymentDate())
                .paymentMethod(payment.getPaymentMethod())
                .remarks(payment.getRemarks())
                .createdAt(payment.getCreatedAt())
                .updatedAt(payment.getUpdatedAt());

        if (payment.getInvoice() != null) {
            builder.invoiceId(payment.getInvoice().getId());
            builder.invoiceNumber(payment.getInvoice().getInvoiceNumber());
        }

        return builder.build();
    }
}