package com.healthcare.backend.reports.repository;

import com.healthcare.backend.reports.entity.SavedReport;
import com.healthcare.backend.reports.enums.ReportType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ReportRepository extends JpaRepository<SavedReport, UUID> {

}