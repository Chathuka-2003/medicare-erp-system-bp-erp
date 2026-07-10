package com.healthcare.backend.laboratory.service;

import com.healthcare.backend.common.exception.BusinessException;
import com.healthcare.backend.common.exception.ResourceNotFoundException;
import com.healthcare.backend.laboratory.dto.LabOrderRequestDto;
import com.healthcare.backend.laboratory.dto.LabOrderResponseDto;
import com.healthcare.backend.laboratory.dto.LabResultRequestDto;
import com.healthcare.backend.laboratory.dto.LabResultResponseDto;
import com.healthcare.backend.laboratory.entity.LabOrder;
import com.healthcare.backend.laboratory.entity.LabOrderItem;
import com.healthcare.backend.laboratory.entity.LabResult;
import com.healthcare.backend.laboratory.entity.LabTest;
import com.healthcare.backend.laboratory.enums.LabTestStatus;
import com.healthcare.backend.laboratory.mapper.LabMapper;
import com.healthcare.backend.laboratory.repository.LabOrderItemRepository;
import com.healthcare.backend.laboratory.repository.LabOrderRepository;
import com.healthcare.backend.laboratory.repository.LabResultRepository;
import com.healthcare.backend.laboratory.repository.LabTestRepository;
import com.healthcare.backend.patient.entity.Patient;
import com.healthcare.backend.patient.repository.PatientRepository;
import com.healthcare.backend.staff.entity.Doctor;
import com.healthcare.backend.staff.entity.Staff;
import com.healthcare.backend.staff.repository.DoctorRepository;
import com.healthcare.backend.staff.repository.StaffRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.Year;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;


public class LabResultServiceImpl implements LabResultService {

}