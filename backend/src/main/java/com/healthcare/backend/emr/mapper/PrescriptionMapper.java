package com.healthcare.backend.emr.mapper;

import com.healthcare.backend.emr.dto.PrescriptionRequestDto;
import com.healthcare.backend.emr.dto.PrescriptionResponseDto;
import com.healthcare.backend.emr.entity.MedicalRecord;
import com.healthcare.backend.emr.entity.Prescription;
import com.healthcare.backend.emr.entity.PrescriptionItem;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;


@Component
public class PrescriptionMapper {

    public Prescription toEntity(PrescriptionRequestDto dto, MedicalRecord medicalRecord) {
        Prescription prescription = new Prescription();
        applyToEntity(prescription, dto, medicalRecord);
        return prescription;
    }

    public void applyToEntity(Prescription prescription, PrescriptionRequestDto dto, MedicalRecord medicalRecord) {
        prescription.setNotes(dto.getNotes());
        prescription.setMedicalRecord(medicalRecord);

        List<PrescriptionItem> items = new ArrayList<>();
        if (dto.getItems() != null) {
            for (PrescriptionRequestDto.PrescriptionItemDto itemDto : dto.getItems()) {
                PrescriptionItem item = new PrescriptionItem();
                item.setMedicineName(itemDto.getMedicineName());
                item.setDosage(itemDto.getDosage());
                item.setFrequency(itemDto.getFrequency());
                item.setDuration(itemDto.getDuration());
                item.setPrescription(prescription);
                items.add(item);
            }
        }

        if (prescription.getItems() == null) {
            prescription.setItems(items);
        } else {
            prescription.getItems().clear();
            prescription.getItems().addAll(items);
        }
    }

    public PrescriptionResponseDto toResponseDto(Prescription prescription) {
        List<PrescriptionResponseDto.PrescriptionItemDto> itemDtos = prescription.getItems() == null
                ? Collections.emptyList()
                : prescription.getItems().stream()
                .map(item -> PrescriptionResponseDto.PrescriptionItemDto.builder()
                        .id(item.getId())
                        .medicineName(item.getMedicineName())
                        .dosage(item.getDosage())
                        .frequency(item.getFrequency())
                        .duration(item.getDuration())
                        .build())
                .collect(Collectors.toList());

        return PrescriptionResponseDto.builder()
                .id(prescription.getId())
                .notes(prescription.getNotes())
                .medicalRecordId(prescription.getMedicalRecord() != null ? prescription.getMedicalRecord().getId() : null)
                .items(itemDtos)
                .createdAt(prescription.getCreatedAt())
                .updatedAt(prescription.getUpdatedAt())
                .build();
    }
}