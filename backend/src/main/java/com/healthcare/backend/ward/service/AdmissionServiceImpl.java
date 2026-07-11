package com.healthcare.backend.ward.service;

import com.healthcare.backend.common.exception.BusinessException;
import com.healthcare.backend.common.exception.ResourceNotFoundException;
import com.healthcare.backend.patient.entity.Patient;
import com.healthcare.backend.patient.repository.PatientRepository;
import com.healthcare.backend.staff.entity.Doctor;
import com.healthcare.backend.staff.repository.DoctorRepository;
import com.healthcare.backend.ward.dto.AdmissionRequestDto;
import com.healthcare.backend.ward.dto.AdmissionResponseDto;
import com.healthcare.backend.ward.entity.Admission;
import com.healthcare.backend.ward.entity.Bed;
import com.healthcare.backend.ward.entity.Ward;
import com.healthcare.backend.ward.enums.BedStatus;
import com.healthcare.backend.ward.mapper.WardMapper;
import com.healthcare.backend.ward.repository.AdmissionRepository;
import com.healthcare.backend.ward.repository.BedRepository;
import com.healthcare.backend.ward.repository.WardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.Year;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class AdmissionServiceImpl implements AdmissionService {

    private final AdmissionRepository admissionRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final BedRepository bedRepository;
    private final WardRepository wardRepository;
    private final WardMapper wardMapper;

    private static final AtomicInteger SEQUENCE = new AtomicInteger(1);

    @Override
    public AdmissionResponseDto admitPatient(AdmissionRequestDto requestDto) {
        Patient patient = patientRepository.findById(requestDto.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Patient not found with id: " + requestDto.getPatientId()));

        Doctor doctor = doctorRepository.findById(requestDto.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Doctor not found with id: " + requestDto.getDoctorId()));

        Bed bed = bedRepository.findById(requestDto.getBedId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Bed not found with id: " + requestDto.getBedId()));

        if (bed.getStatus() != BedStatus.AVAILABLE) {
            throw new BusinessException("Selected bed is not available");
        }

        Admission admission = new Admission();
        admission.setAdmissionNumber(generateAdmissionNumber());
        admission.setAdmissionDate(LocalDateTime.now());
        admission.setDiagnosis(requestDto.getDiagnosis());
        admission.setRemarks(requestDto.getRemarks());
        admission.setPatient(patient);
        admission.setDoctor(doctor);
        admission.setBed(bed);

        Admission saved = admissionRepository.save(admission);

        bed.setStatus(BedStatus.OCCUPIED);
        bedRepository.save(bed);

        Ward ward = bed.getWard();
        if (ward != null) {
            ward.setAvailableBeds(Math.max(0, ward.getAvailableBeds() - 1));
            wardRepository.save(ward);
        }

        return wardMapper.toResponseDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public AdmissionResponseDto getAdmissionById(UUID id) {
        return wardMapper.toResponseDto(findAdmissionOrThrow(id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<AdmissionResponseDto> getAdmissionsByPatient(UUID patientId) {
        return admissionRepository.findByPatientId(patientId).stream()
                .map(wardMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AdmissionResponseDto> getCurrentAdmissions() {
        return admissionRepository.findByDischargeDateIsNull().stream()
                .map(wardMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public AdmissionResponseDto dischargePatient(UUID id) {
        Admission admission = findAdmissionOrThrow(id);

        if (admission.getDischargeDate() != null) {
            throw new BusinessException("Patient has already been discharged from this admission");
        }

        admission.setDischargeDate(LocalDateTime.now());
        Admission updated = admissionRepository.save(admission);

        Bed bed = admission.getBed();
        if (bed != null) {
            bed.setStatus(BedStatus.AVAILABLE);
            bedRepository.save(bed);

            Ward ward = bed.getWard();
            if (ward != null) {
                ward.setAvailableBeds(ward.getAvailableBeds() + 1);
                wardRepository.save(ward);
            }
        }

        return wardMapper.toResponseDto(updated);
    }

    private Admission findAdmissionOrThrow(UUID id) {
        return admissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Admission not found with id: " + id));
    }

    private synchronized String generateAdmissionNumber() {
        int year = Year.now().getValue();
        int seq = SEQUENCE.getAndIncrement();
        String candidate;
        do {
            candidate = String.format("ADM-%d-%05d", year, seq);
            seq = SEQUENCE.getAndIncrement();
        } while (admissionRepository.existsByAdmissionNumber(candidate));
        return candidate;
    }
}
