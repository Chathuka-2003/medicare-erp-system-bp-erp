package com.healthcare.backend.billing.service;

import com.healthcare.backend.billing.dto.PaymentRequestDto;
import com.healthcare.backend.billing.dto.PaymentResponseDto;

import java.util.List;
import java.util.UUID;

public interface PaymentService {

    PaymentResponseDto recordPayment(PaymentRequestDto requestDto);

    List<PaymentResponseDto> getPaymentsByInvoice(UUID invoiceId);

    void deletePayment(UUID id);
}