package com.healthcare.backend.ward.dto;

import com.healthcare.backend.ward.enums.BedStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class BedRequestDto {

    @NotNull(message = "Ward is required")
    private UUID wardId;

    @NotBlank(message = "Bed number is required")
    private String bedNumber;

    private String roomNumber;

    private BedStatus status;
}
