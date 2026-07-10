package com.healthcare.backend.reports.service;

import com.healthcare.backend.billing.enums.InvoiceStatus;
import com.healthcare.backend.billing.repository.InvoiceRepository;
import com.healthcare.backend.laboratory.enums.LabTestStatus;
import com.healthcare.backend.laboratory.repository.LabOrderRepository;
import com.healthcare.backend.appointment.repository.AppointmentRepository;
import com.healthcare.backend.inventory.repository.ItemRepository;
import com.healthcare.backend.patient.repository.PatientRepository;
import com.healthcare.backend.pharmacy.repository.MedicineRepository;
import com.healthcare.backend.reports.dto.DashboardDto;
import com.healthcare.backend.staff.repository.DoctorRepository;
import com.healthcare.backend.staff.repository.StaffRepository;
import com.healthcare.backend.ward.repository.AdmissionRepository;
import com.healthcare.backend.ward.repository.WardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;


public class DashboardServiceImpl implements DashboardService {

}