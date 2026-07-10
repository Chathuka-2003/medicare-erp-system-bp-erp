package com.healthcare.backend.staff.repository;

import com.healthcare.backend.staff.entity.Staff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface StaffRepository extends JpaRepository<Staff, UUID>, JpaSpecificationExecutor<Staff> {

    Optional<Staff> findByEmployeeNumber(String employeeNumber);

    Optional<Staff> findByEmail(String email);

    boolean existsByEmployeeNumber(String employeeNumber);

    boolean existsByEmail(String email);

    List<Staff> findByDepartmentId(UUID departmentId);

    List<Staff> findByDoctorId(UUID doctorId);
}