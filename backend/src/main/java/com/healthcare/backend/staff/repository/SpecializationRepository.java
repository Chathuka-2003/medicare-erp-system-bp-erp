package com.healthcare.backend.staff.repository;

import com.healthcare.backend.staff.entity.Specialization;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface SpecializationRepository extends JpaRepository<Specialization, UUID> {
    boolean existsByName(String name);
}