package com.healthcare.backend.billing.mapper;

import com.healthcare.backend.billing.dto.InvoiceRequestDto;
import com.healthcare.backend.billing.dto.InvoiceResponseDto;
import com.healthcare.backend.billing.entity.Invoice;
import com.healthcare.backend.billing.entity.InvoiceItem;
import com.healthcare.backend.billing.enums.InvoiceStatus;
import com.healthcare.backend.appointment.entity.Appointment;
import com.healthcare.backend.patient.entity.Patient;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class InvoiceMapper {

    public Invoice toEntity(InvoiceRequestDto dto, Patient patient, Appointment appointment) {
        Invoice invoice = new Invoice();
        applyToEntity(invoice, dto, patient, appointment);
        return invoice;
    }

    public void applyToEntity(Invoice invoice, InvoiceRequestDto dto, Patient patient, Appointment appointment) {
        invoice.setInvoiceDate(dto.getInvoiceDate());
        invoice.setDueDate(dto.getDueDate());
        invoice.setPatient(patient);
        invoice.setAppointment(appointment);

        List<InvoiceItem> items = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        for (InvoiceRequestDto.InvoiceItemDto itemDto : dto.getItems()) {
            InvoiceItem item = new InvoiceItem();
            item.setItemName(itemDto.getItemName());
            item.setQuantity(itemDto.getQuantity());
            item.setUnitPrice(itemDto.getUnitPrice());
            BigDecimal lineTotal = itemDto.getUnitPrice().multiply(BigDecimal.valueOf(itemDto.getQuantity()));
            item.setTotalPrice(lineTotal);
            item.setInvoice(invoice);
            items.add(item);
            total = total.add(lineTotal);
        }

        if (invoice.getItems() == null) {
            invoice.setItems(items);
        } else {
            invoice.getItems().clear();
            invoice.getItems().addAll(items);
        }

        invoice.setTotalAmount(total);

        BigDecimal alreadyPaid = invoice.getPaidAmount() != null ? invoice.getPaidAmount() : BigDecimal.ZERO;
        invoice.setPaidAmount(alreadyPaid);
        invoice.setBalanceAmount(total.subtract(alreadyPaid));

        if (invoice.getStatus() == null) {
            invoice.setStatus(InvoiceStatus.ISSUED);
        }
    }

    public InvoiceResponseDto toResponseDto(Invoice invoice) {
        List<InvoiceResponseDto.InvoiceItemDto> itemDtos = invoice.getItems() == null
                ? List.of()
                : invoice.getItems().stream()
                .map(item -> InvoiceResponseDto.InvoiceItemDto.builder()
                        .id(item.getId())
                        .itemName(item.getItemName())
                        .quantity(item.getQuantity())
                        .unitPrice(item.getUnitPrice())
                        .totalPrice(item.getTotalPrice())
                        .build())
                .collect(Collectors.toList());

        InvoiceResponseDto.InvoiceResponseDtoBuilder builder = InvoiceResponseDto.builder()
                .id(invoice.getId())
                .invoiceNumber(invoice.getInvoiceNumber())
                .invoiceDate(invoice.getInvoiceDate())
                .dueDate(invoice.getDueDate())
                .totalAmount(invoice.getTotalAmount())
                .paidAmount(invoice.getPaidAmount())
                .balanceAmount(invoice.getBalanceAmount())
                .status(invoice.getStatus())
                .items(itemDtos)
                .createdAt(invoice.getCreatedAt())
                .updatedAt(invoice.getUpdatedAt());

        if (invoice.getPatient() != null) {
            builder.patientId(invoice.getPatient().getId());
            builder.patientName((invoice.getPatient().getFirstName() + " " +
                    (invoice.getPatient().getLastName() != null ? invoice.getPatient().getLastName() : "")).trim());
        }

        if (invoice.getAppointment() != null) {
            builder.appointmentId(invoice.getAppointment().getId());
        }

        return builder.build();
    }
}