package com.healthcare.backend.inventory.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SupplierResponseDto {

    private UUID id;
    private String supplierName;
    private String contactPerson;
    private String phone;
    private String email;
    private String address;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
