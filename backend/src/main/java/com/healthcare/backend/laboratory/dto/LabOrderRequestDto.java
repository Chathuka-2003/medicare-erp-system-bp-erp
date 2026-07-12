package com.healthcare.backend.laboratory.dto;

import com.healthcare.backend.laboratory.enums.LabOrderSubjectType;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
public class LabOrderRequestDto {

    private LabOrderSubjectType patientType;

    private UUID patientId;

    private UUID staffId;

    private String otherName;

    @NotNull(message = "Doctor is required")
    private UUID doctorId;

    @NotEmpty(message = "At least one lab test is required")
    private List<UUID> labTestIds;
}
