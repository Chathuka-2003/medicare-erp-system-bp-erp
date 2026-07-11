package com.healthcare.backend.laboratory.dto;

import com.healthcare.backend.laboratory.enums.LabTestStatus;
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
public class LabOrderResponseDto {

    private UUID id;
    private String orderNumber;
    private LocalDateTime orderDate;
    private LabTestStatus status;

    private com.healthcare.backend.laboratory.enums.LabOrderSubjectType patientType;
    private UUID patientId;
    private UUID staffId;
    private String otherName;
    private String patientName;

    private UUID doctorId;
    private String doctorName;

    private List<LabOrderItemDto> orderItems;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LabOrderItemDto {
        private UUID id;
        private UUID labTestId;
        private String testName;
        private boolean resultAvailable;
    }
}
