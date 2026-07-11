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

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardServiceImpl implements DashboardService {

    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final StaffRepository staffRepository;
    private final AppointmentRepository appointmentRepository;
    private final InvoiceRepository invoiceRepository;
    private final AdmissionRepository admissionRepository;
    private final WardRepository wardRepository;
    private final MedicineRepository medicineRepository;
    private final ItemRepository itemRepository;
    private final LabOrderRepository labOrderRepository;

    @Override
    public DashboardDto getDashboardSummary() {
        LocalDateTime startOfToday = LocalDateTime.now().toLocalDate().atStartOfDay();
        LocalDateTime endOfToday = startOfToday.plusDays(1);

        long todaysAppointments = appointmentRepository.findAll().stream()
                .filter(a -> a.getAppointmentDate() != null
                        && !a.getAppointmentDate().isBefore(startOfToday)
                        && a.getAppointmentDate().isBefore(endOfToday))
                .count();

        long upcomingAppointments = appointmentRepository.findAll().stream()
                .filter(a -> a.getAppointmentDate() != null && a.getAppointmentDate().isAfter(LocalDateTime.now()))
                .count();

        BigDecimal totalRevenue = invoiceRepository.findAll().stream()
                .map(inv -> inv.getPaidAmount() != null ? inv.getPaidAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalOutstanding = invoiceRepository.findAll().stream()
                .map(inv -> inv.getBalanceAmount() != null ? inv.getBalanceAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long unpaidInvoices = invoiceRepository.findByStatus(InvoiceStatus.ISSUED).size()
                + invoiceRepository.findByStatus(InvoiceStatus.PARTIALLY_PAID).size()
                + invoiceRepository.findByStatus(InvoiceStatus.OVERDUE).size();

        long totalBeds = wardRepository.findAll().stream()
                .mapToLong(w -> w.getTotalBeds() != null ? w.getTotalBeds() : 0)
                .sum();

        long availableBeds = wardRepository.findAll().stream()
                .mapToLong(w -> w.getAvailableBeds() != null ? w.getAvailableBeds() : 0)
                .sum();

        long lowStockMedicines = medicineRepository.findAll().stream()
                .filter(m -> m.getStocks() != null && m.getStocks().stream()
                        .mapToInt(s -> s.getQuantityInStock() != null ? s.getQuantityInStock() : 0)
                        .sum() <= 10) // simple threshold since Medicine has no dedicated reorder level field
                .count();

        long lowStockItems = itemRepository.findAll().stream()
                .filter(i -> i.getReorderLevel() != null && i.getQuantityInStock() != null
                        && i.getQuantityInStock() <= i.getReorderLevel())
                .count();

        long pendingLabOrders = labOrderRepository.findAll().stream()
                .filter(o -> o.getStatus() == LabTestStatus.ORDERED || o.getStatus() == LabTestStatus.IN_PROGRESS)
                .count();

        return DashboardDto.builder()
                .totalPatients(patientRepository.count())
                .totalDoctors(doctorRepository.count())
                .totalStaff(staffRepository.count())
                .todaysAppointments(todaysAppointments)
                .upcomingAppointments(upcomingAppointments)
                .totalRevenueCollected(totalRevenue)
                .totalOutstandingBalance(totalOutstanding)
                .unpaidInvoiceCount(unpaidInvoices)
                .currentAdmissions(admissionRepository.findByDischargeDateIsNull().size())
                .totalBeds(totalBeds)
                .availableBeds(availableBeds)
                .lowStockMedicineCount(lowStockMedicines)
                .lowStockItemCount(lowStockItems)
                .pendingLabOrders(pendingLabOrders)
                .build();
    }
}
