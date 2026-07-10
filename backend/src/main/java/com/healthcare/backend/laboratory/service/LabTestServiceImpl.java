package com.healthcare.backend.laboratory.service;

import com.healthcare.backend.common.exception.BusinessException;
import com.healthcare.backend.common.exception.ResourceNotFoundException;
import com.healthcare.backend.laboratory.dto.LabTestRequestDto;
import com.healthcare.backend.laboratory.dto.LabTestResponseDto;
import com.healthcare.backend.laboratory.entity.LabTest;
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


public class LabTestServiceImpl implements LabTestService {

}