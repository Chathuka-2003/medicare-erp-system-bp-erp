package com.healthcare.backend.ward.repository;

import com.healthcare.backend.ward.entity.Ward;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface WardRepository extends JpaRepository<Ward, UUID> {

    Optional<Ward> findByWardCode(String wardCode);

    boolean existsByWardCode(String wardCode);
}