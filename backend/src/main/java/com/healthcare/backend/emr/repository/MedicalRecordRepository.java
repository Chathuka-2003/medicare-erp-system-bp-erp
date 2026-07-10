package com.healthcare.backend.emr.repository;

import com.healthcare.backend.emr.entity.MedicalRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.UUID;

public interface MedicalRecordRepository extends JpaRepository<MedicalRecord, UUID>, JpaSpecificationExecutor<MedicalRecord> {

    List<MedicalRecord> findByPatientId(UUID patientId);

    List<MedicalRecord> findByDoctorId(UUID doctorId);
}