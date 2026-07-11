package com.healthcare.backend.pharmacy.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DrugDispenseResponseDto {

    private UUID id;
    private String dispenseNumber;
    private LocalDateTime dispenseDate;
    private String remarks;

    private UUID patientId;
    private String patientName;

    private UUID prescriptionId;