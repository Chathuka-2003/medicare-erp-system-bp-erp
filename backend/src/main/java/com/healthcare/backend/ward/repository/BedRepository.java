package com.healthcare.backend.ward.repository;

import com.healthcare.backend.ward.entity.Bed;
import com.healthcare.backend.ward.enums.BedStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface BedRepository extends JpaRepository<Bed, UUID> {

    List<Bed> findByWardId(UUID wardId);

    List<Bed> findByWardIdAndStatus(UUID wardId, BedStatus status);

    List<Bed> findByStatus(BedStatus status);
}