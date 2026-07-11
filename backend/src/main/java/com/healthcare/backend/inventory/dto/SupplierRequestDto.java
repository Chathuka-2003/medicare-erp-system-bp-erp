package com.healthcare.backend.inventory.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SupplierRequestDto {

    @NotBlank(message = "Supplier name is required")
    private String supplierName;

    private String contactPerson;

    private String phone;

    @Email(message = "Invalid email format")
    private String email;

    private String address;
}
