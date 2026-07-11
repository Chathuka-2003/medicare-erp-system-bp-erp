package com.healthcare.backend.laboratory.mapper;

import com.healthcare.backend.laboratory.dto.*;
import com.healthcare.backend.laboratory.entity.LabOrder;
import com.healthcare.backend.laboratory.entity.LabOrderItem;
import com.healthcare.backend.laboratory.entity.LabResult;
import com.healthcare.backend.laboratory.entity.LabTest;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class LabMapper {

    public LabTestResponseDto toResponseDto(LabTest labTest) {
        return LabTestResponseDto.builder()
                .id(labTest.getId())
                .testCode(labTest.getTestCode())
                .testName(labTest.getTestName())
                .category(labTest.getCategory())
                .description(labTest.getDescription())
                .price(labTest.getPrice())
                .sampleType(labTest.getSampleType())
                .normalRange(labTest.getNormalRange())
                .createdAt(labTest.getCreatedAt())
                .updatedAt(labTest.getUpdatedAt())
                .build();
    }

    public LabOrderResponseDto toResponseDto(LabOrder labOrder) {
        List<LabOrderResponseDto.LabOrderItemDto> itemDtos = labOrder.getOrderItems() == null
                ? Collections.emptyList()
                : labOrder.getOrderItems().stream()
                .map(item -> LabOrderResponseDto.LabOrderItemDto.builder()
                        .id(item.getId())
                        .labTestId(item.getLabTest() != null ? item.getLabTest().getId() : null)
                        .testName(item.getLabTest() != null ? item.getLabTest().getTestName() : null)
                        .resultAvailable(item.getLabResult() != null)
                        .build())
                .collect(Collectors.toList());

        LabOrderResponseDto.LabOrderResponseDtoBuilder builder = LabOrderResponseDto.builder()
                .id(labOrder.getId())
                .orderNumber(labOrder.getOrderNumber())
                .orderDate(labOrder.getOrderDate())
                .status(labOrder.getStatus())
                .orderItems(itemDtos)
                .createdAt(labOrder.getCreatedAt())
                .updatedAt(labOrder.getUpdatedAt());

        if (labOrder.getPatient() != null) {
            builder.patientId(labOrder.getPatient().getId());
            builder.patientName((labOrder.getPatient().getFirstName() + " " +
                    (labOrder.getPatient().getLastName() != null ? labOrder.getPatient().getLastName() : "")).trim());
        }

        if (labOrder.getDoctor() != null) {
            builder.doctorId(labOrder.getDoctor().getId());
            builder.doctorName((labOrder.getDoctor().getFirstName() + " " +
                    (labOrder.getDoctor().getLastName() != null ? labOrder.getDoctor().getLastName() : "")).trim());
        }

        return builder.build();
    }

    public LabResultResponseDto toResponseDto(LabResult labResult) {
        LabResultResponseDto.LabResultResponseDtoBuilder builder = LabResultResponseDto.builder()
                .id(labResult.getId())
                .resultValue(labResult.getResultValue())
                .remarks(labResult.getRemarks())
                .completedDate(labResult.getCompletedDate())
                .createdAt(labResult.getCreatedAt())
                .updatedAt(labResult.getUpdatedAt());

        LabOrderItem orderItem = labResult.getLabOrderItem();
        if (orderItem != null) {
            builder.labOrderItemId(orderItem.getId());
            if (orderItem.getLabTest() != null) {
                builder.testName(orderItem.getLabTest().getTestName());
            }
        }

        if (labResult.getVerifiedBy() != null) {
            builder.verifiedById(labResult.getVerifiedBy().getId());
            builder.verifiedByName((labResult.getVerifiedBy().getFirstName() + " " +
                    (labResult.getVerifiedBy().getLastName() != null ? labResult.getVerifiedBy().getLastName() : "")).trim());
        }

        return builder.build();
    }
}
