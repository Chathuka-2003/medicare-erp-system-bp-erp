package com.healthcare.backend.emr.dto;

import com.healthcare.backend.emr.enums.RecordType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;



@Getter
@Setter
public class MedicalRecordRequestDto {

    @NotNull(message = "Patient is required")
    private UUID patientId;

    @NotNull(message = "Doctor is required")
    private UUID doctorId;

    @NotNull(message = "Record date is required")
    private LocalDate recordDate;

    private String description;

    @NotNull(message = "Record type is required")
    private RecordType recordType;

    @Valid
    private VitalsDto vitals;

    @Valid
    private List<DiagnosisDto> diagnoses;

    @Valid
    private PrescriptionRequestDto prescription;

    @Getter
    @Setter
    public static class VitalsDto {
        private Double temperature;
        private Integer heartRate;
        private Integer bloodPressure;
        private Double weight;
        private Double height;
    }

    @Getter
    @Setter
    public static class DiagnosisDto {
        private String diagnosisName;
        private String description;
        private String severity;
    }
}