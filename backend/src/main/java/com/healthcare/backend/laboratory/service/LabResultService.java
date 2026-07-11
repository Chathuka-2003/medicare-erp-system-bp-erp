package com.healthcare.backend.laboratory.service;

import com.healthcare.backend.laboratory.dto.LabOrderRequestDto;
import com.healthcare.backend.laboratory.dto.LabOrderResponseDto;
import com.healthcare.backend.laboratory.dto.LabResultRequestDto;
import com.healthcare.backend.laboratory.dto.LabResultResponseDto;

import java.util.List;
import java.util.UUID;

public interface LabResultService {

    LabOrderResponseDto createLabOrder(LabOrderRequestDto requestDto);

    LabOrderResponseDto getLabOrderById(UUID id);

    List<LabOrderResponseDto> getLabOrdersByPatient(UUID patientId);

    LabResultResponseDto recordResult(LabResultRequestDto requestDto);

    LabResultResponseDto getResultByOrderItem(UUID labOrderItemId);
}
