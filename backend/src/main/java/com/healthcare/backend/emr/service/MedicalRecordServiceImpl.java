package com.healthcare.backend.emr.service;

import com.healthcare.backend.common.exception.ResourceNotFoundException;
import com.healthcare.backend.emr.dto.MedicalRecordRequestDto;
import com.healthcare.backend.emr.dto.MedicalRecordResponseDto;
import com.healthcare.backend.emr.entity.MedicalRecord;
import com.healthcare.backend.emr.mapper.MedicalRecordMapper;
import com.healthcare.backend.emr.repository.MedicalRecordRepository;
import com.healthcare.backend.patient.entity.Patient;
import com.healthcare.backend.patient.repository.PatientRepository;
import com.healthcare.backend.staff.entity.Doctor;
import com.healthcare.backend.staff.repository.DoctorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

public class MedicalRecordServiceImpl implements MedicalRecordService {

}