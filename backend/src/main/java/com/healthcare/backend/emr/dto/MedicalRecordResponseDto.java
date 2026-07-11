package com.healthcare.backend.emr.dto;

import com.healthcare.backend.emr.enums.RecordType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MedicalRecordResponseDto {

    private UUID id;
    private LocalDate recordDate;
    private String description;
    private RecordType recordType;

    private UUID patientId;
    private String patientName;

    private UUID doctorId;
    private String doctorName;

    private VitalsDto vitals;
    private List<DiagnosisDto> diagnoses;
    private PrescriptionResponseDto prescription;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VitalsDto {
        private UUID id;
        private Double temperature;
        private Integer heartRate;
        private Integer bloodPressure;
        private Double weight;
        private Double height;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DiagnosisDto {
        private UUID id;
        private String diagnosisName;
        private String description;
        private String severity;
    }
}