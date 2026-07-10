package com.healthcare.backend.emr.service;

import com.healthcare.backend.common.exception.BusinessException;
import com.healthcare.backend.common.exception.ResourceNotFoundException;
import com.healthcare.backend.emr.dto.PrescriptionRequestDto;
import com.healthcare.backend.emr.dto.PrescriptionResponseDto;
import com.healthcare.backend.emr.entity.MedicalRecord;
import com.healthcare.backend.emr.entity.Prescription;
import com.healthcare.backend.emr.mapper.PrescriptionMapper;
import com.healthcare.backend.emr.repository.MedicalRecordRepository;
import com.healthcare.backend.emr.repository.PrescriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

public class PrescriptionServiceImpl implements PrescriptionService {

}