package com.healthcare.backend.pharmacy.service;

import com.healthcare.backend.common.exception.BusinessException;
import com.healthcare.backend.common.exception.ResourceNotFoundException;
import com.healthcare.backend.emr.entity.Prescription;
import com.healthcare.backend.emr.repository.PrescriptionRepository;
import com.healthcare.backend.patient.entity.Patient;
import com.healthcare.backend.patient.repository.PatientRepository;
import com.healthcare.backend.pharmacy.dto.DrugDispenseRequestDto;
import com.healthcare.backend.pharmacy.dto.DrugDispenseResponseDto;
import com.healthcare.backend.pharmacy.entity.DrugDispense;
import com.healthcare.backend.pharmacy.entity.DrugDispenseItem;
import com.healthcare.backend.pharmacy.entity.Medicine;
import com.healthcare.backend.pharmacy.entity.MedicineStock;
import com.healthcare.backend.pharmacy.repository.DrugDispenseRepository;
import com.healthcare.backend.pharmacy.repository.MedicineRepository;
import com.healthcare.backend.pharmacy.repository.MedicineStockRepository;
import com.healthcare.backend.staff.entity.Staff;
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


public class DrugDispenseServiceImpl implements DrugDispenseService {

}