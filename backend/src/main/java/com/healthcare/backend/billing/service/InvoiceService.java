package com.healthcare.backend.billing.service;

import com.healthcare.backend.billing.dto.InvoiceRequestDto;
import com.healthcare.backend.billing.dto.InvoiceResponseDto;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.UUID;

public interface InvoiceService {

    InvoiceResponseDto createInvoice(InvoiceRequestDto requestDto);

    InvoiceResponseDto getInvoiceById(UUID id);

    List<InvoiceResponseDto> getInvoicesByPatient(UUID patientId);

    Page<InvoiceResponseDto> getAllInvoices(int page, int size, String sortBy, String sortDirection);

    InvoiceResponseDto updateInvoice(UUID id, InvoiceRequestDto requestDto);

    void cancelInvoice(UUID id);

    void deleteInvoice(UUID id);
}