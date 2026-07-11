package com.healthcare.backend.billing.controller;

import com.healthcare.backend.billing.dto.InvoiceRequestDto;
import com.healthcare.backend.billing.dto.InvoiceResponseDto;
import com.healthcare.backend.billing.service.InvoiceService;
import com.healthcare.backend.common.dto.ApiResponse;
import com.healthcare.backend.common.dto.PageResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/invoices")
@RequiredArgsConstructor
public class InvoiceController {

private final InvoiceService invoiceService;

    @PostMapping
    public ResponseEntity<ApiResponse<InvoiceResponseDto>> createInvoice(
            @Valid @RequestBody InvoiceRequestDto requestDto) {
        InvoiceResponseDto created = invoiceService.createInvoice(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Invoice created successfully", created));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<InvoiceResponseDto>> getInvoiceById(@PathVariable UUID id) {
        InvoiceResponseDto invoice = invoiceService.getInvoiceById(id);
        return ResponseEntity.ok(ApiResponse.success("Invoice retrieved successfully", invoice));
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<ApiResponse<List<InvoiceResponseDto>>> getInvoicesByPatient(
            @PathVariable UUID patientId) {
        List<InvoiceResponseDto> invoices = invoiceService.getInvoicesByPatient(patientId);
        return ResponseEntity.ok(ApiResponse.success("Invoices retrieved successfully", invoices));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<InvoiceResponseDto>>> getAllInvoices(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "ASC") String sortDirection) {

        Page<InvoiceResponseDto> result = invoiceService.getAllInvoices(page, size, sortBy, sortDirection);
        return ResponseEntity.ok(ApiResponse.success("Invoices retrieved successfully", PageResponse.of(result)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<InvoiceResponseDto>> updateInvoice(
            @PathVariable UUID id, @Valid @RequestBody InvoiceRequestDto requestDto) {
        InvoiceResponseDto updated = invoiceService.updateInvoice(id, requestDto);
        return ResponseEntity.ok(ApiResponse.success("Invoice updated successfully", updated));
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<Void>> cancelInvoice(@PathVariable UUID id) {
        invoiceService.cancelInvoice(id);
        return ResponseEntity.ok(ApiResponse.success("Invoice cancelled successfully", null));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteInvoice(@PathVariable UUID id) {
        invoiceService.deleteInvoice(id);
        return ResponseEntity.ok(ApiResponse.success("Invoice deleted successfully", null));
    }
}