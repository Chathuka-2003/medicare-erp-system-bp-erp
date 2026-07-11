package com.healthcare.backend.laboratory.service;

import com.healthcare.backend.common.exception.BusinessException;
import com.healthcare.backend.common.exception.ResourceNotFoundException;
import com.healthcare.backend.laboratory.dto.LabTestRequestDto;
import com.healthcare.backend.laboratory.dto.LabTestResponseDto;
import com.healthcare.backend.laboratory.entity.LabTest;
import com.healthcare.backend.laboratory.enums.LabTestCategory;
import com.healthcare.backend.laboratory.mapper.LabMapper;
import com.healthcare.backend.laboratory.repository.LabTestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class LabTestServiceImpl implements LabTestService {

    private final LabTestRepository labTestRepository;
    private final LabMapper labMapper;

    @Override
    public LabTestResponseDto createLabTest(LabTestRequestDto requestDto) {
        if (labTestRepository.existsByTestCode(requestDto.getTestCode())) {
            throw new BusinessException("A lab test with this code already exists");
        }

        LabTest labTest = new LabTest();
        applyToEntity(labTest, requestDto);
        LabTest saved = labTestRepository.save(labTest);
        return labMapper.toResponseDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public LabTestResponseDto getLabTestById(UUID id) {
        return labMapper.toResponseDto(findLabTestOrThrow(id));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<LabTestResponseDto> getAllLabTests(int page, int size, String sortBy, String sortDirection) {
        Pageable pageable = buildPageable(page, size, sortBy, sortDirection);
        return labTestRepository.findAll(pageable).map(labMapper::toResponseDto);
    }

    @Override
    public LabTestResponseDto updateLabTest(UUID id, LabTestRequestDto requestDto) {
        LabTest labTest = findLabTestOrThrow(id);

        if (!requestDto.getTestCode().equals(labTest.getTestCode())
                && labTestRepository.existsByTestCode(requestDto.getTestCode())) {
            throw new BusinessException("A lab test with this code already exists");
        }

        applyToEntity(labTest, requestDto);
        LabTest updated = labTestRepository.save(labTest);
        return labMapper.toResponseDto(updated);
    }

    @Override
    public void deleteLabTest(UUID id) {
        LabTest labTest = findLabTestOrThrow(id);
        labTestRepository.delete(labTest);
    }

    private void applyToEntity(LabTest labTest, LabTestRequestDto dto) {
        labTest.setTestCode(dto.getTestCode());
        labTest.setTestName(dto.getTestName());
        labTest.setCategory(dto.getCategory());
        labTest.setDescription(dto.getDescription());
        labTest.setPrice(dto.getPrice());
        labTest.setSampleType(dto.getSampleType());
        labTest.setNormalRange(dto.getNormalRange());
    }

    private LabTest findLabTestOrThrow(UUID id) {
        return labTestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lab test not found with id: " + id));
    }

    private Pageable buildPageable(int page, int size, String sortBy, String sortDirection) {
        Sort.Direction direction = "DESC".equalsIgnoreCase(sortDirection) ? Sort.Direction.DESC : Sort.Direction.ASC;
        String sortField = (sortBy == null || sortBy.isBlank()) ? "id" : sortBy;
        return PageRequest.of(page, size, Sort.by(direction, sortField));
    }
}
