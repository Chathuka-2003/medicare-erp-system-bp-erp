package com.healthcare.backend.reports.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardDto {

    // Patients & staff
    private long totalPatients;
    private long totalDoctors;
    private long totalStaff;

    // Appointments
    private long todaysAppointments;
    private long upcomingAppointments;

    // Billing
    private BigDecimal totalRevenueCollected;
    private BigDecimal totalOutstandingBalance;
    private long unpaidInvoiceCount;

    // Ward
    private long currentAdmissions;
    private long totalBeds;
    private long availableBeds;

    // Pharmacy & Inventory
    private long lowStockMedicineCount;
    private long lowStockItemCount;

    // Lab
    private long pendingLabOrders;
}
