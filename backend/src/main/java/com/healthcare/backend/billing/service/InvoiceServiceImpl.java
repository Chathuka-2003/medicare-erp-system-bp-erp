package com.healthcare.backend.billing.service;

import com.healthcare.backend.appointment.entity.Appointment;
import com.healthcare.backend.appointment.repository.AppointmentRepository;
import com.healthcare.backend.billing.dto.InvoiceRequestDto;
import com.healthcare.backend.billing.dto.InvoiceResponseDto;
import com.healthcare.backend.billing.entity.Invoice;
import com.healthcare.backend.billing.enums.InvoiceStatus;
import com.healthcare.backend.billing.mapper.InvoiceMapper;
import com.healthcare.backend.billing.repository.InvoiceRepository;
import com.healthcare.backend.common.exception.ResourceNotFoundException;
import com.healthcare.backend.patient.entity.Patient;
import com.healthcare.backend.patient.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Year;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class InvoiceServiceImpl implements InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final PatientRepository patientRepository;
    private final AppointmentRepository appointmentRepository;
    private final InvoiceMapper invoiceMapper;

    private static final AtomicInteger SEQUENCE = new AtomicInteger(1);

    @Override
    public InvoiceResponseDto createInvoice(InvoiceRequestDto requestDto) {
        Patient patient = findPatientOrThrow(requestDto.getPatientId());
        Appointment appointment = requestDto.getAppointmentId() != null
                ? findAppointmentOrThrow(requestDto.getAppointmentId())
                : null;

        Invoice invoice = invoiceMapper.toEntity(requestDto, patient, appointment);
        invoice.setInvoiceNumber(generateInvoiceNumber());

        Invoice saved = invoiceRepository.save(invoice);
        return invoiceMapper.toResponseDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public InvoiceResponseDto getInvoiceById(UUID id) {
        return invoiceMapper.toResponseDto(findInvoiceOrThrow(id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<InvoiceResponseDto> getInvoicesByPatient(UUID patientId) {
        return invoiceRepository.findByPatientId(patientId).stream()
                .map(invoiceMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<InvoiceResponseDto> getAllInvoices(int page, int size, String sortBy, String sortDirection) {
        Pageable pageable = buildPageable(page, size, sortBy, sortDirection);
        return invoiceRepository.findAll(pageable).map(invoiceMapper::toResponseDto);
    }

    @Override
    public InvoiceResponseDto updateInvoice(UUID id, InvoiceRequestDto requestDto) {
        Invoice invoice = findInvoiceOrThrow(id);
        Patient patient = findPatientOrThrow(requestDto.getPatientId());
        Appointment appointment = requestDto.getAppointmentId() != null
                ? findAppointmentOrThrow(requestDto.getAppointmentId())
                : null;

        invoiceMapper.applyToEntity(invoice, requestDto, patient, appointment);
        Invoice updated = invoiceRepository.save(invoice);
        return invoiceMapper.toResponseDto(updated);
    }

    @Override
    public void cancelInvoice(UUID id) {
        Invoice invoice = findInvoiceOrThrow(id);
        invoice.setStatus(InvoiceStatus.CANCELLED);
        invoiceRepository.save(invoice);
    }

    @Override
    public void deleteInvoice(UUID id) {
        Invoice invoice = findInvoiceOrThrow(id);
        invoiceRepository.delete(invoice);
    }

    private Invoice findInvoiceOrThrow(UUID id) {
        return invoiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found with id: " + id));
    }

    private Patient findPatientOrThrow(UUID id) {
        return patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + id));
    }

    private Appointment findAppointmentOrThrow(UUID id) {
        return appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id: " + id));
    }

    private Pageable buildPageable(int page, int size, String sortBy, String sortDirection) {
        Sort.Direction direction = "DESC".equalsIgnoreCase(sortDirection) ? Sort.Direction.DESC : Sort.Direction.ASC;
        String sortField = (sortBy == null || sortBy.isBlank()) ? "id" : sortBy;
        return PageRequest.of(page, size, Sort.by(direction, sortField));
    }

    private synchronized String generateInvoiceNumber() {
        int year = Year.now().getValue();
        int seq = SEQUENCE.getAndIncrement();
        String candidate;
        do {
            candidate = String.format("INV-%d-%05d", year, seq);
            seq = SEQUENCE.getAndIncrement();
        } while (invoiceRepository.existsByInvoiceNumber(candidate));
        return candidate;
    }
}