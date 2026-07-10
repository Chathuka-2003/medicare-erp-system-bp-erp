package com.healthcare.backend.reports.entity;

import com.healthcare.backend.common.base.BaseEntity;
import com.healthcare.backend.reports.enums.ReportType;
import com.healthcare.backend.staff.entity.Staff;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "saved_reports")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SavedReport extends BaseEntity {

    @Column(nullable = false)
    private String reportName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReportType reportType;

    @Column(length = 5000)
    private String reportParameters;

    @Column(length = 1000)
    private String description;

    private String fileName;

    private String filePath;

    private String fileFormat;

    private LocalDateTime generatedAt;

    @ManyToOne
    @JoinColumn(name = "generated_by")
    private Staff generatedBy;

}