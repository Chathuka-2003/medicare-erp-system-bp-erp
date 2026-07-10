package com.healthcare.backend.ward.service;

import com.healthcare.backend.common.exception.BusinessException;
import com.healthcare.backend.common.exception.ResourceNotFoundException;
import com.healthcare.backend.patient.entity.Patient;
import com.healthcare.backend.patient.repository.PatientRepository;
import com.healthcare.backend.staff.entity.Doctor;
import com.healthcare.backend.staff.repository.DoctorRepository;
import com.healthcare.backend.ward.dto.AdmissionRequestDto;
import com.healthcare.backend.ward.dto.AdmissionResponseDto;
import com.healthcare.backend.ward.entity.Admission;
import com.healthcare.backend.ward.entity.Bed;
import com.healthcare.backend.ward.entity.Ward;
import com.healthcare.backend.ward.enums.BedStatus;
import com.healthcare.backend.ward.mapper.WardMapper;
import com.healthcare.backend.ward.repository.AdmissionRepository;
import com.healthcare.backend.ward.repository.BedRepository;
import com.healthcare.backend.ward.repository.WardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.Year;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

public class AdmissionServiceImpl implements AdmissionService {

}