package com.healthcare.backend.laboratory.repository;

import com.healthcare.backend.laboratory.entity.LabOrder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface LabOrderRepository extends JpaRepository<LabOrder, UUID> {

    Optional<LabOrder> findByOrderNumber(String orderNumber);

    boolean existsByOrderNumber(String orderNumber);

    List<LabOrder> findByPatientId(UUID patientId);

    List<LabOrder> findByDoctorId(UUID doctorId);
}