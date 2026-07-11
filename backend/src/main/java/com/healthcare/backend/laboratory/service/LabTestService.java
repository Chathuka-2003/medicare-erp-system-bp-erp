package com.healthcare.backend.laboratory.service;

import com.healthcare.backend.laboratory.dto.LabTestRequestDto;
import com.healthcare.backend.laboratory.dto.LabTestResponseDto;
import org.springframework.data.domain.Page;

import java.util.UUID;

public interface LabTestService {

    LabTestResponseDto createLabTest(LabTestRequestDto requestDto);

    LabTestResponseDto getLabTestById(UUID id);

    Page<LabTestResponseDto> getAllLabTests(int page, int size, String sortBy, String sortDirection);

    LabTestResponseDto updateLabTest(UUID id, LabTestRequestDto requestDto);

    void deleteLabTest(UUID id);
}
