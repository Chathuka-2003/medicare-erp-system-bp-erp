package com.healthcare.backend.billing.service;

import com.healthcare.backend.billing.dto.PaymentRequestDto;
import com.healthcare.backend.billing.dto.PaymentResponseDto;
import com.healthcare.backend.billing.entity.Invoice;
import com.healthcare.backend.billing.entity.Payment;
import com.healthcare.backend.billing.enums.InvoiceStatus;
import com.healthcare.backend.billing.mapper.PaymentMapper;
import com.healthcare.backend.billing.repository.InvoiceRepository;
import com.healthcare.backend.billing.repository.PaymentRepository;
import com.healthcare.backend.common.exception.BusinessException;
import com.healthcare.backend.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.Year;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final InvoiceRepository invoiceRepository;
    private final PaymentMapper paymentMapper;

    private static final AtomicInteger SEQUENCE = new AtomicInteger(1);

    @Override
    public PaymentResponseDto recordPayment(PaymentRequestDto requestDto) {
        Invoice invoice = invoiceRepository.findById(requestDto.getInvoiceId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Invoice not found with id: " + requestDto.getInvoiceId()));

        BigDecimal currentBalance = invoice.getBalanceAmount() != null ? invoice.getBalanceAmount() : BigDecimal.ZERO;
        if (requestDto.getAmount().compareTo(currentBalance) > 0) {
            throw new BusinessException("Payment amount exceeds the outstanding balance");
        }

        Payment payment = new Payment();
        payment.setPaymentReference(generatePaymentReference());
        payment.setAmount(requestDto.getAmount());
        payment.setPaymentDate(requestDto.getPaymentDate() != null ? requestDto.getPaymentDate() : LocalDateTime.now());
        payment.setPaymentMethod(requestDto.getPaymentMethod());
        payment.setRemarks(requestDto.getRemarks());
        payment.setInvoice(invoice);

        Payment saved = paymentRepository.save(payment);

        BigDecimal newPaid = (invoice.getPaidAmount() != null ? invoice.getPaidAmount() : BigDecimal.ZERO)
                .add(requestDto.getAmount());
        BigDecimal newBalance = invoice.getTotalAmount().subtract(newPaid);

        invoice.setPaidAmount(newPaid);
        invoice.setBalanceAmount(newBalance);
        invoice.setStatus(newBalance.compareTo(BigDecimal.ZERO) <= 0
                ? InvoiceStatus.PAID
                : InvoiceStatus.PARTIALLY_PAID);
        invoiceRepository.save(invoice);

        return paymentMapper.toResponseDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PaymentResponseDto> getPaymentsByInvoice(UUID invoiceId) {
        return paymentRepository.findByInvoiceId(invoiceId).stream()
                .map(paymentMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public void deletePayment(UUID id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id: " + id));

        Invoice invoice = payment.getInvoice();
        if (invoice != null) {
            BigDecimal newPaid = invoice.getPaidAmount().subtract(payment.getAmount());
            invoice.setPaidAmount(newPaid);
            invoice.setBalanceAmount(invoice.getTotalAmount().subtract(newPaid));
            invoice.setStatus(newPaid.compareTo(BigDecimal.ZERO) <= 0
                    ? InvoiceStatus.ISSUED
                    : InvoiceStatus.PARTIALLY_PAID);
            invoiceRepository.save(invoice);
        }

        paymentRepository.delete(payment);
    }

    private synchronized String generatePaymentReference() {
        int year = Year.now().getValue();
        int seq = SEQUENCE.getAndIncrement();
        return String.format("PAY-%d-%05d", year, seq);
    }
}