package com.healthcare.backend.billing.controller;

import com.healthcare.backend.billing.dto.PaymentRequestDto;
import com.healthcare.backend.billing.dto.PaymentResponseDto;
import com.healthcare.backend.billing.service.PaymentService;
import com.healthcare.backend.common.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
public class PaymentController {

private final PaymentService paymentService;

    @PostMapping
    public ResponseEntity<ApiResponse<PaymentResponseDto>> recordPayment(
            @Valid @RequestBody PaymentRequestDto requestDto) {
        PaymentResponseDto created = paymentService.recordPayment(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Payment recorded successfully", created));
    }

    @GetMapping("/invoice/{invoiceId}")
    public ResponseEntity<ApiResponse<List<PaymentResponseDto>>> getPaymentsByInvoice(
            @PathVariable UUID invoiceId) {
        List<PaymentResponseDto> payments = paymentService.getPaymentsByInvoice(invoiceId);
        return ResponseEntity.ok(ApiResponse.success("Payments retrieved successfully", payments));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deletePayment(@PathVariable UUID id) {
        paymentService.deletePayment(id);
        return ResponseEntity.ok(ApiResponse.success("Payment deleted successfully", null));
    }
}