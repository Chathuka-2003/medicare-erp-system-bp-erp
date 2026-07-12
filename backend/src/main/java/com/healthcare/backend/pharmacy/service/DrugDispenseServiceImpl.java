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

@Service
@RequiredArgsConstructor
@Transactional
public class DrugDispenseServiceImpl implements DrugDispenseService {

    private final DrugDispenseRepository drugDispenseRepository;
    private final PatientRepository patientRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final StaffRepository staffRepository;
    private final MedicineRepository medicineRepository;
    private final MedicineStockRepository medicineStockRepository;

    private static final AtomicInteger SEQUENCE = new AtomicInteger(1);

    @Override
    public DrugDispenseResponseDto createDispense(DrugDispenseRequestDto requestDto) {
        Patient patient = patientRepository.findById(requestDto.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Patient not found with id: " + requestDto.getPatientId()));

        Prescription prescription = requestDto.getPrescriptionId() != null
                ? prescriptionRepository.findById(requestDto.getPrescriptionId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Prescription not found with id: " + requestDto.getPrescriptionId()))
                : null;

        Staff pharmacist = staffRepository.findById(requestDto.getPharmacistId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Pharmacist not found with id: " + requestDto.getPharmacistId()));

        DrugDispense dispense = new DrugDispense();
        dispense.setDispenseNumber(generateDispenseNumber());
        dispense.setDispenseDate(LocalDateTime.now());
        dispense.setRemarks(requestDto.getRemarks());
        dispense.setPatient(patient);
        dispense.setPrescription(prescription);
        dispense.setPharmacist(pharmacist);

        List<DrugDispenseItem> items = new ArrayList<>();
        for (DrugDispenseRequestDto.DrugDispenseItemDto itemDto : requestDto.getItems()) {
            Medicine medicine = medicineRepository.findById(itemDto.getMedicineId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Medicine not found with id: " + itemDto.getMedicineId()));

            deductStock(medicine.getId(), itemDto.getQuantity());

            DrugDispenseItem item = new DrugDispenseItem();
            item.setMedicine(medicine);
            item.setQuantity(itemDto.getQuantity());
            item.setDosage(itemDto.getDosage());
            item.setInstructions(itemDto.getInstructions());
            item.setDrugDispense(dispense);
            items.add(item);
        }
        dispense.setItems(items);

        DrugDispense saved = drugDispenseRepository.save(dispense);
        return toResponseDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public DrugDispenseResponseDto getDispenseById(UUID id) {
        return toResponseDto(findDispenseOrThrow(id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<DrugDispenseResponseDto> getDispensesByPatient(UUID patientId) {
        return drugDispenseRepository.findByPatientId(patientId).stream()
                .map(this::toResponseDto)
                .collect(Collectors.toList());
    }

    /**
     * Deducts the requested quantity from stock batches oldest-expiry-first (FEFO).
     * Throws if total available stock across all batches is insufficient.
     */
    private void deductStock(UUID medicineId, int quantityNeeded) {
        List<MedicineStock> batches = medicineStockRepository
                .findByMedicineIdAndQuantityInStockGreaterThanOrderByExpiryDateAsc(medicineId, 0);

        int remaining = quantityNeeded;
        for (MedicineStock batch : batches) {
            if (remaining <= 0) break;

            int available = batch.getQuantityInStock();
            int deduct = Math.min(available, remaining);
            batch.setQuantityInStock(available - deduct);
            medicineStockRepository.save(batch);
            remaining -= deduct;
        }

        if (remaining > 0) {
            throw new BusinessException("Insufficient stock for medicine id: " + medicineId);
        }
    }

    private DrugDispenseResponseDto toResponseDto(DrugDispense dispense) {
        List<DrugDispenseResponseDto.DrugDispenseItemDto> itemDtos = dispense.getItems() == null
                ? List.of()
                : dispense.getItems().stream()
                .map(item -> DrugDispenseResponseDto.DrugDispenseItemDto.builder()
                        .id(item.getId())
                        .medicineId(item.getMedicine() != null ? item.getMedicine().getId() : null)
                        .medicineName(item.getMedicine() != null ? item.getMedicine().getMedicineName() : null)
                        .quantity(item.getQuantity())
                        .dosage(item.getDosage())
                        .instructions(item.getInstructions())
                        .build())
                .collect(Collectors.toList());

        DrugDispenseResponseDto.DrugDispenseResponseDtoBuilder builder = DrugDispenseResponseDto.builder()
                .id(dispense.getId())
                .dispenseNumber(dispense.getDispenseNumber())
                .dispenseDate(dispense.getDispenseDate())
                .remarks(dispense.getRemarks())
                .items(itemDtos)
                .createdAt(dispense.getCreatedAt())
                .updatedAt(dispense.getUpdatedAt());

        if (dispense.getPatient() != null) {
            builder.patientId(dispense.getPatient().getId());
            builder.patientName((dispense.getPatient().getFirstName() + " " +
                    (dispense.getPatient().getLastName() != null ? dispense.getPatient().getLastName() : "")).trim());
        }

        if (dispense.getPrescription() != null) {
            builder.prescriptionId(dispense.getPrescription().getId());
        }

        if (dispense.getPharmacist() != null) {
            builder.pharmacistId(dispense.getPharmacist().getId());
            builder.pharmacistName((dispense.getPharmacist().getFirstName() + " " +
                    (dispense.getPharmacist().getLastName() != null ? dispense.getPharmacist().getLastName() : "")).trim());
        }

        return builder.build();
    }

    private DrugDispense findDispenseOrThrow(UUID id) {
        return drugDispenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Drug dispense not found with id: " + id));
    }

    private synchronized String generateDispenseNumber() {
        int year = Year.now().getValue();
        int seq = SEQUENCE.getAndIncrement();
        String candidate;
        do {
            candidate = String.format("DSP-%d-%05d", year, seq);
            seq = SEQUENCE.getAndIncrement();
        } while (drugDispenseRepository.existsByDispenseNumber(candidate));
        return candidate;
    }
}