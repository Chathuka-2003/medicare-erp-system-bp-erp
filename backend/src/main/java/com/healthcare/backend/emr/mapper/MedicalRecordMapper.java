package com.healthcare.backend.emr.mapper;

import com.healthcare.backend.emr.dto.MedicalRecordRequestDto;
import com.healthcare.backend.emr.dto.MedicalRecordResponseDto;
import com.healthcare.backend.emr.entity.Diagnosis;
import com.healthcare.backend.emr.entity.MedicalRecord;
import com.healthcare.backend.emr.entity.Vitals;
import com.healthcare.backend.patient.entity.Patient;
import com.healthcare.backend.staff.entity.Doctor;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;



@Component
public class MedicalRecordMapper {

    public MedicalRecord toEntity(MedicalRecordRequestDto dto, Patient patient, Doctor doctor) {
        MedicalRecord record = new MedicalRecord();
        applyToEntity(record, dto, patient, doctor);
        return record;
    }

    public void applyToEntity(MedicalRecord record, MedicalRecordRequestDto dto, Patient patient, Doctor doctor) {
        record.setRecordDate(dto.getRecordDate());
        record.setDescription(dto.getDescription());
        record.setRecordType(dto.getRecordType());
        record.setPatient(patient);
        record.setDoctor(doctor);

        if (dto.getVitals() != null) {
            Vitals vitals = record.getVitals() != null ? record.getVitals() : new Vitals();
            vitals.setTemperature(dto.getVitals().getTemperature());
            vitals.setHeartRate(dto.getVitals().getHeartRate());
            vitals.setBloodPressure(dto.getVitals().getBloodPressure());
            vitals.setWeight(dto.getVitals().getWeight());
            vitals.setHeight(dto.getVitals().getHeight());
            vitals.setMedicalRecord(record);
            record.setVitals(vitals);
        }

        if (dto.getDiagnoses() != null) {
            List<Diagnosis> diagnoses = new ArrayList<>();
            for (MedicalRecordRequestDto.DiagnosisDto diagnosisDto : dto.getDiagnoses()) {
                Diagnosis diagnosis = new Diagnosis();
                diagnosis.setDiagnosisName(diagnosisDto.getDiagnosisName());
                diagnosis.setDescription(diagnosisDto.getDescription());
                diagnosis.setSeverity(diagnosisDto.getSeverity());
                diagnosis.setMedicalRecord(record);
                diagnoses.add(diagnosis);
            }
            if (record.getDiagnoses() == null) {
                record.setDiagnoses(diagnoses);
            } else {
                record.getDiagnoses().clear();
                record.getDiagnoses().addAll(diagnoses);
            }
        }
    }

    public MedicalRecordResponseDto toResponseDto(MedicalRecord record) {
        MedicalRecordResponseDto.MedicalRecordResponseDtoBuilder builder = MedicalRecordResponseDto.builder()
                .id(record.getId())
                .recordDate(record.getRecordDate())
                .description(record.getDescription())
                .recordType(record.getRecordType())
                .createdAt(record.getCreatedAt())
                .updatedAt(record.getUpdatedAt());

        if (record.getPatient() != null) {
            builder.patientId(record.getPatient().getId());
            builder.patientName((record.getPatient().getFirstName() + " " +
                    (record.getPatient().getLastName() != null ? record.getPatient().getLastName() : "")).trim());
        }

        if (record.getDoctor() != null) {
            builder.doctorId(record.getDoctor().getId());
            builder.doctorName((record.getDoctor().getFirstName() + " " +
                    (record.getDoctor().getLastName() != null ? record.getDoctor().getLastName() : "")).trim());
        }

        if (record.getVitals() != null) {
            Vitals v = record.getVitals();
            builder.vitals(MedicalRecordResponseDto.VitalsDto.builder()
                    .id(v.getId())
                    .temperature(v.getTemperature())
                    .heartRate(v.getHeartRate())
                    .bloodPressure(v.getBloodPressure())
                    .weight(v.getWeight())
                    .height(v.getHeight())
                    .build());
        }

        if (record.getDiagnoses() != null) {
            List<MedicalRecordResponseDto.DiagnosisDto> diagnosisDtos = record.getDiagnoses().stream()
                    .map(d -> MedicalRecordResponseDto.DiagnosisDto.builder()
                            .id(d.getId())
                            .diagnosisName(d.getDiagnosisName())
                            .description(d.getDescription())
                            .severity(d.getSeverity())
                            .build())
                    .collect(Collectors.toList());
            builder.diagnoses(diagnosisDtos);
        } else {
            builder.diagnoses(Collections.emptyList());
        }

        return builder.build();
    }
}