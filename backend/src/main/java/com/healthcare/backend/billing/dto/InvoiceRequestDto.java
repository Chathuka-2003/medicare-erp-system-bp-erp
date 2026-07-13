package com.healthcare.backend.billing.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
//import java.time.LocalDate;

@Getter
@Setter
public class InvoiceRequestDto {

 @NotNull(message = "Patient is required")
    private UUID patientId;

    private UUID appointmentId;

    @NotNull(message = "Invoice date is required")
    private LocalDate invoiceDate;

    private LocalDate dueDate;

    @NotEmpty(message = "At least one invoice item is required")
    @Valid
    private List<InvoiceItemDto> items;

    @Getter
    @Setter
    public static class InvoiceItemDto {

        @NotNull(message = "Item name is required")
        private String itemName;

        @NotNull(message = "Quantity is required")
        private Integer quantity;

        @NotNull(message = "Unit price is required")
        private java.math.BigDecimal unitPrice;
    }
}