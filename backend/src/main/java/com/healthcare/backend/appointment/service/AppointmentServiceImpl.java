package com.healthcare.backend.appointment.service;

import com.healthcare.backend.appointment.dto.AppointmentRequestDto;
import com.healthcare.backend.appointment.dto.AppointmentResponseDto;
import com.healthcare.backend.appointment.entity.Appointment;
import com.healthcare.backend.appointment.enums.AppointmentStatus;
import com.healthcare.backend.appointment.mapper.AppointmentMapper;
import com.healthcare.backend.appointment.repository.AppointmentRepository;
import com.healthcare.backend.common.exception.BusinessException;
import com.healthcare.backend.common.exception.ResourceNotFoundException;
import com.healthcare.backend.patient.entity.Patient;
import com.healthcare.backend.patient.repository.PatientRepository;
import com.healthcare.backend.staff.entity.Doctor;
import com.healthcare.backend.staff.repository.DoctorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final AppointmentMapper appointmentMapper;

    @Override
    public AppointmentResponseDto createAppointment(AppointmentRequestDto requestDto) {
        Patient patient = findPatientOrThrow(requestDto.getPatientId());
        Doctor doctor = findDoctorOrThrow(requestDto.getDoctorId());

        if (appointmentRepository.existsByDoctorIdAndAppointmentDate(
                requestDto.getDoctorId(), requestDto.getAppointmentDate())) {
            throw new BusinessException("This doctor already has an appointment at the selected time");
        }

        Appointment appointment = appointmentMapper.toEntity(requestDto, patient, doctor);
        Appointment saved = appointmentRepository.save(appointment);
        return appointmentMapper.toResponseDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public AppointmentResponseDto getAppointmentById(UUID id) {
        return appointmentMapper.toResponseDto(findAppointmentOrThrow(id));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AppointmentResponseDto> getAllAppointments(int page, int size, String sortBy, String sortDirection) {
        Pageable pageable = buildPageable(page, size, sortBy, sortDirection);
        return appointmentRepository.findAll(pageable).map(appointmentMapper::toResponseDto);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AppointmentResponseDto> getAppointmentsByPatient(UUID patientId) {
        return appointmentRepository.findByPatientId(patientId).stream()
                .map(appointmentMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AppointmentResponseDto> getAppointmentsByDoctor(UUID doctorId) {
        return appointmentRepository.findByDoctorId(doctorId).stream()
                .map(appointmentMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public AppointmentResponseDto updateAppointment(UUID id, AppointmentRequestDto requestDto) {
        Appointment appointment = findAppointmentOrThrow(id);
        Patient patient = findPatientOrThrow(requestDto.getPatientId());
        Doctor doctor = findDoctorOrThrow(requestDto.getDoctorId());

        appointmentMapper.applyToEntity(appointment, requestDto, patient, doctor);
        Appointment updated = appointmentRepository.save(appointment);
        return appointmentMapper.toResponseDto(updated);
    }

    @Override
    public AppointmentResponseDto updateStatus(UUID id, AppointmentStatus status) {
        Appointment appointment = findAppointmentOrThrow(id);
        appointment.setStatus(status);
        return appointmentMapper.toResponseDto(appointmentRepository.save(appointment));
    }

    @Override
    public void cancelAppointment(UUID id) {
        Appointment appointment = findAppointmentOrThrow(id);
        appointment.setStatus(AppointmentStatus.CANCELLED);
        appointmentRepository.save(appointment);
    }

    @Override
    public void deleteAppointment(UUID id) {
        Appointment appointment = findAppointmentOrThrow(id);
        appointmentRepository.delete(appointment);
    }

    private Appointment findAppointmentOrThrow(UUID id) {
        return appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id: " + id));
    }

    private Patient findPatientOrThrow(UUID id) {
        return patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + id));
    }

    private Doctor findDoctorOrThrow(UUID id) {
        return doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + id));
    }

    private Pageable buildPageable(int page, int size, String sortBy, String sortDirection) {
        Sort.Direction direction = "DESC".equalsIgnoreCase(sortDirection) ? Sort.Direction.DESC : Sort.Direction.ASC;
        String sortField = (sortBy == null || sortBy.isBlank()) ? "id" : sortBy;
        return PageRequest.of(page, size, Sort.by(direction, sortField));
    }
}