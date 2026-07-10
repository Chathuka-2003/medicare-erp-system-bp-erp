package com.healthcare.backend.staff.service;

import com.healthcare.backend.common.exception.BusinessException;
import com.healthcare.backend.common.exception.ResourceNotFoundException;
import com.healthcare.backend.staff.dto.StaffRequestDto;
import com.healthcare.backend.staff.dto.StaffResponseDto;
import com.healthcare.backend.staff.entity.Department;
import com.healthcare.backend.staff.entity.Doctor;
import com.healthcare.backend.staff.entity.Staff;
import com.healthcare.backend.staff.mapper.StaffMapper;
import com.healthcare.backend.staff.repository.DepartmentRepository;
import com.healthcare.backend.staff.repository.DoctorRepository;
import com.healthcare.backend.staff.repository.StaffRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;


public class StaffServiceImpl implements StaffService {

}