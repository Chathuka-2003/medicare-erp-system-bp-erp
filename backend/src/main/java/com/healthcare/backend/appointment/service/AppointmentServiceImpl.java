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

    

