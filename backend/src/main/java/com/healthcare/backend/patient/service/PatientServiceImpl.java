package com.healthcare.backend.patient.service;

import com.healthcare.backend.common.exception.BusinessException;
import com.healthcare.backend.common.exception.ResourceNotFoundException;
import com.healthcare.backend.patient.dto.PatientRequestDto;
import com.healthcare.backend.patient.dto.PatientResponseDto;
import com.healthcare.backend.patient.dto.PatientSearchDto;
import com.healthcare.backend.patient.entity.Patient;
import com.healthcare.backend.patient.mapper.PatientMapper;
import com.healthcare.backend.patient.repository.PatientRepository;
import com.healthcare.backend.patient.repository.PatientSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Year;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;

public class PatientServiceImpl implements PatientService {

}