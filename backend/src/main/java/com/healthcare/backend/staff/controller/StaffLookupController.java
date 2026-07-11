package com.healthcare.backend.staff.controller;

import com.healthcare.backend.common.dto.ApiResponse;
import com.healthcare.backend.staff.entity.Department;
import com.healthcare.backend.staff.entity.Specialization;
import com.healthcare.backend.staff.repository.DepartmentRepository;
import com.healthcare.backend.staff.repository.SpecializationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class StaffLookupController {

    private final DepartmentRepository departmentRepository;
    private final SpecializationRepository specializationRepository;

    @GetMapping("/departments")
    public ResponseEntity<ApiResponse<List<LookupDto>>> getDepartments() {
        List<LookupDto> departments = departmentRepository.findAll(Sort.by("name")).stream()
                .map(this::toLookup)
                .toList();
        return ResponseEntity.ok(ApiResponse.success("Departments retrieved successfully", departments));
    }

    @GetMapping("/specializations")
    public ResponseEntity<ApiResponse<List<LookupDto>>> getSpecializations() {
        List<LookupDto> specializations = specializationRepository.findAll(Sort.by("name")).stream()
                .map(this::toLookup)
                .toList();
        return ResponseEntity.ok(ApiResponse.success("Specializations retrieved successfully", specializations));
    }

    private LookupDto toLookup(Department department) {
        return new LookupDto(department.getId(), department.getName());
    }

    private LookupDto toLookup(Specialization specialization) {
        return new LookupDto(specialization.getId(), specialization.getName());
    }

    public record LookupDto(UUID id, String name) {
    }
}
