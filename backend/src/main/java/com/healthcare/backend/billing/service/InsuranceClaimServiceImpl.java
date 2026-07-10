package com.healthcare.backend.billing.service;

import com.healthcare.backend.billing.dto.InsuranceClaimRequestDto;
import com.healthcare.backend.billing.dto.InsuranceClaimResponseDto;
import com.healthcare.backend.billing.entity.Invoice;
import com.healthcare.backend.billing.entity.InsuranceClaim;
import com.healthcare.backend.billing.repository.InvoiceRepository;
import com.healthcare.backend.billing.repository.InsuranceClaimRepository;
import com.healthcare.backend.common.exception.ResourceNotFoundException;
import com.healthcare.backend.patient.entity.Patient;
import com.healthcare.backend.patient.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
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
public class InsuranceClaimServiceImpl implements InsuranceClaimService {

    private final InsuranceClaimRepository insuranceClaimRepository;
    private final PatientRepository patientRepository;
    private final InvoiceRepository invoiceRepository;

    private static final AtomicInteger SEQUENCE = new AtomicInteger(1);

    @Override
    public InsuranceClaimResponseDto createClaim(InsuranceClaimRequestDto requestDto) {
        Patient patient = findPatientOrThrow(requestDto.getPatientId());
        Invoice invoice = requestDto.getInvoiceId() != null
                ? findInvoiceOrThrow(requestDto.getInvoiceId())
                : null;

        InsuranceClaim claim = new InsuranceClaim();
        applyToEntity(claim, requestDto, patient, invoice);
        claim.setClaimNumber(generateClaimNumber());

        InsuranceClaim saved = insuranceClaimRepository.save(claim);
        return toResponseDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public InsuranceClaimResponseDto getClaimById(UUID id) {
        return toResponseDto(findClaimOrThrow(id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<InsuranceClaimResponseDto> getClaimsByPatient(UUID patientId) {
        return insuranceClaimRepository.findByPatientId(patientId).stream()
                .map(this::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public InsuranceClaimResponseDto updateClaim(UUID id, InsuranceClaimRequestDto requestDto) {
        InsuranceClaim claim = findClaimOrThrow(id);
        Patient patient = findPatientOrThrow(requestDto.getPatientId());
        Invoice invoice = requestDto.getInvoiceId() != null
                ? findInvoiceOrThrow(requestDto.getInvoiceId())
                : null;

        applyToEntity(claim, requestDto, patient, invoice);
        InsuranceClaim updated = insuranceClaimRepository.save(claim);
        return toResponseDto(updated);
    }

    @Override
    public void deleteClaim(UUID id) {
        InsuranceClaim claim = findClaimOrThrow(id);
        insuranceClaimRepository.delete(claim);
    }

    private void applyToEntity(InsuranceClaim claim, InsuranceClaimRequestDto dto, Patient patient, Invoice invoice) {
        claim.setInsuranceProvider(dto.getInsuranceProvider());
        claim.setClaimAmount(dto.getClaimAmount());
        claim.setApprovedAmount(dto.getApprovedAmount());
        claim.setClaimDate(dto.getClaimDate());
        claim.setSettlementDate(dto.getSettlementDate());
        claim.setStatus(dto.getStatus());
        claim.setPatient(patient);
        claim.setInvoice(invoice);
    }

    private InsuranceClaimResponseDto toResponseDto(InsuranceClaim claim) {
        InsuranceClaimResponseDto.InsuranceClaimResponseDtoBuilder builder = InsuranceClaimResponseDto.builder()
                .id(claim.getId())
                .claimNumber(claim.getClaimNumber())
                .insuranceProvider(claim.getInsuranceProvider())
                .claimAmount(claim.getClaimAmount())
                .approvedAmount(claim.getApprovedAmount())
                .claimDate(claim.getClaimDate())
                .settlementDate(claim.getSettlementDate())
                .status(claim.getStatus())
                .createdAt(claim.getCreatedAt())
                .updatedAt(claim.getUpdatedAt());

        if (claim.getPatient() != null) {
            builder.patientId(claim.getPatient().getId());
            builder.patientName((claim.getPatient().getFirstName() + " " +
                    (claim.getPatient().getLastName() != null ? claim.getPatient().getLastName() : "")).trim());
        }

        if (claim.getInvoice() != null) {
            builder.invoiceId(claim.getInvoice().getId());
            builder.invoiceNumber(claim.getInvoice().getInvoiceNumber());
        }

        return builder.build();
    }

    private InsuranceClaim findClaimOrThrow(UUID id) {
        return insuranceClaimRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Insurance claim not found with id: " + id));
    }

    private Patient findPatientOrThrow(UUID id) {
        return patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + id));
    }

    private Invoice findInvoiceOrThrow(UUID id) {
        return invoiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found with id: " + id));
    }

    private synchronized String generateClaimNumber() {
        int year = Year.now().getValue();
        int seq = SEQUENCE.getAndIncrement();
        String candidate;
        do {
            candidate = String.format("CLM-%d-%05d", year, seq);
            seq = SEQUENCE.getAndIncrement();
        } while (insuranceClaimRepository.existsByClaimNumber(candidate));
        return candidate;
    }
}