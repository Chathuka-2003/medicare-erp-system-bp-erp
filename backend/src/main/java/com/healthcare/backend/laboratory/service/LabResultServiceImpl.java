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
import com.healthcare.backend.laboratory.enums.LabOrderSubjectType;
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

@Service
@RequiredArgsConstructor
@Transactional
public class LabResultServiceImpl implements LabResultService {

    private final LabOrderRepository labOrderRepository;
    private final LabOrderItemRepository labOrderItemRepository;
    private final LabResultRepository labResultRepository;
    private final LabTestRepository labTestRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final StaffRepository staffRepository;
    private final LabMapper labMapper;

    private static final AtomicInteger SEQUENCE = new AtomicInteger(1);

    @Override
    public LabOrderResponseDto createLabOrder(LabOrderRequestDto requestDto) {
        Doctor doctor = doctorRepository.findById(requestDto.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Doctor not found with id: " + requestDto.getDoctorId()));

        LabOrder order = new LabOrder();
        order.setOrderNumber(generateOrderNumber());
        order.setOrderDate(LocalDateTime.now());
        order.setDoctor(doctor);
        order.setStatus(LabTestStatus.ORDERED);

        if (requestDto.getPatientType() == null || requestDto.getPatientType() == LabOrderSubjectType.PATIENT) {
            order.setPatientType(LabOrderSubjectType.PATIENT);
            if (requestDto.getPatientId() == null) {
                throw new BusinessException("Patient ID is required for PATIENT subject type");
            }
            Patient patient = patientRepository.findById(requestDto.getPatientId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Patient not found with id: " + requestDto.getPatientId()));
            order.setPatient(patient);
        } else if (requestDto.getPatientType() == LabOrderSubjectType.STAFF) {
            order.setPatientType(LabOrderSubjectType.STAFF);
            if (requestDto.getStaffId() == null) {
                throw new BusinessException("Staff ID is required for STAFF subject type");
            }
            Staff staff = staffRepository.findById(requestDto.getStaffId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Staff member not found with id: " + requestDto.getStaffId()));
            order.setStaff(staff);
        } else if (requestDto.getPatientType() == LabOrderSubjectType.OTHER) {
            order.setPatientType(LabOrderSubjectType.OTHER);
            if (requestDto.getOtherName() == null || requestDto.getOtherName().isBlank()) {
                throw new BusinessException("Other Name is required for OTHER subject type");
            }
            order.setOtherName(requestDto.getOtherName());
        }

        List<LabOrderItem> items = new ArrayList<>();
        for (UUID testId : requestDto.getLabTestIds()) {
            LabTest labTest = labTestRepository.findById(testId)
                    .orElseThrow(() -> new ResourceNotFoundException("Lab test not found with id: " + testId));

            LabOrderItem item = new LabOrderItem();
            item.setLabTest(labTest);
            item.setLabOrder(order);
            items.add(item);
        }
        order.setOrderItems(items);

        LabOrder saved = labOrderRepository.save(order);
        return labMapper.toResponseDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public LabOrderResponseDto getLabOrderById(UUID id) {
        return labMapper.toResponseDto(findOrderOrThrow(id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<LabOrderResponseDto> getLabOrdersByPatient(UUID patientId) {
        return labOrderRepository.findByPatientId(patientId).stream()
                .map(labMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public LabResultResponseDto recordResult(LabResultRequestDto requestDto) {
        LabOrderItem orderItem = labOrderItemRepository.findById(requestDto.getLabOrderItemId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Lab order item not found with id: " + requestDto.getLabOrderItemId()));

        if (orderItem.getLabResult() != null) {
            throw new BusinessException("A result has already been recorded for this order item");
        }

        Staff verifiedBy = staffRepository.findById(requestDto.getVerifiedById())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Staff member not found with id: " + requestDto.getVerifiedById()));

        LabResult result = new LabResult();
        result.setLabOrderItem(orderItem);
        result.setResultValue(requestDto.getResultValue());
        result.setRemarks(requestDto.getRemarks());
        result.setCompletedDate(LocalDateTime.now());
        result.setVerifiedBy(verifiedBy);

        LabResult saved = labResultRepository.save(result);

        updateOrderStatusIfComplete(orderItem.getLabOrder());

        return labMapper.toResponseDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public LabResultResponseDto getResultByOrderItem(UUID labOrderItemId) {
        LabResult result = labResultRepository.findByLabOrderItemId(labOrderItemId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No result found for lab order item: " + labOrderItemId));
        return labMapper.toResponseDto(result);
    }

    private void updateOrderStatusIfComplete(LabOrder order) {
        boolean allComplete = order.getOrderItems().stream()
                .allMatch(item -> item.getLabResult() != null || labResultRepository
                        .findByLabOrderItemId(item.getId()).isPresent());

        if (allComplete) {
            order.setStatus(LabTestStatus.COMPLETED);
            labOrderRepository.save(order);
        } else {
            order.setStatus(LabTestStatus.IN_PROGRESS);
            labOrderRepository.save(order);
        }
    }

    private LabOrder findOrderOrThrow(UUID id) {
        return labOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lab order not found with id: " + id));
    }

    private synchronized String generateOrderNumber() {
        int year = Year.now().getValue();
        int seq = SEQUENCE.getAndIncrement();
        String candidate;
        do {
            candidate = String.format("LAB-%d-%05d", year, seq);
            seq = SEQUENCE.getAndIncrement();
        } while (labOrderRepository.existsByOrderNumber(candidate));
        return candidate;
    }
}
