package com.healthcare.backend.config;

import com.healthcare.backend.common.enums.UserRole;
import com.healthcare.backend.staff.entity.Department;
import com.healthcare.backend.staff.entity.Specialization;
import com.healthcare.backend.staff.entity.Staff;
import com.healthcare.backend.staff.repository.DepartmentRepository;
import com.healthcare.backend.staff.repository.SpecializationRepository;
import com.healthcare.backend.staff.repository.StaffRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private static final String DEFAULT_ADMIN_EMAIL = "admin@healthcare.local";
    private static final String DEFAULT_ADMIN_PASSWORD = "Admin@123";
    private static final String DEFAULT_ADMIN_EMPLOYEE_NUMBER = "EMP-00001";

    private final StaffRepository staffRepository;
    private final DepartmentRepository departmentRepository;
    private final SpecializationRepository specializationRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedDepartments();
        seedSpecializations();

        boolean adminExists = staffRepository.findByEmail(DEFAULT_ADMIN_EMAIL).isPresent();

        if (adminExists) {
            log.info("Default admin account already exists, skipping seed.");
            return;
        }

        Staff admin = new Staff();
        admin.setFirstName("System");
        admin.setLastName("Administrator");
        admin.setEmail(DEFAULT_ADMIN_EMAIL);
        admin.setEmployeeNumber(DEFAULT_ADMIN_EMPLOYEE_NUMBER);
        admin.setPassword(passwordEncoder.encode(DEFAULT_ADMIN_PASSWORD));
        admin.setRole(UserRole.SUPER_ADMIN);
        admin.setActive(true);

        staffRepository.save(admin);

        log.info("==============================================");
        log.info("Default admin account created:");
        log.info("  Email:    {}", DEFAULT_ADMIN_EMAIL);
        log.info("  Password: {}", DEFAULT_ADMIN_PASSWORD);
        log.info("  CHANGE THIS PASSWORD IMMEDIATELY AFTER FIRST LOGIN");
        log.info("==============================================");
    }

    private void seedDepartments() {
        createDepartmentIfMissing("General Medicine", "Primary care and internal medicine");
        createDepartmentIfMissing("Emergency", "Emergency and urgent care");
        createDepartmentIfMissing("Cardiology", "Heart and vascular services");
        createDepartmentIfMissing("Pediatrics", "Child health services");
        createDepartmentIfMissing("Laboratory", "Diagnostics and lab operations");
    }

    private void seedSpecializations() {
        createSpecializationIfMissing("General Practitioner", "General medical practice");
        createSpecializationIfMissing("Cardiologist", "Cardiac care");
        createSpecializationIfMissing("Pediatrician", "Child health");
        createSpecializationIfMissing("Emergency Physician", "Emergency care");
    }

    private void createDepartmentIfMissing(String name, String description) {
        if (!departmentRepository.existsByName(name)) {
            Department department = new Department();
            department.setName(name);
            department.setDescription(description);
            departmentRepository.save(department);
        }
    }

    private void createSpecializationIfMissing(String name, String description) {
        if (!specializationRepository.existsByName(name)) {
            Specialization specialization = new Specialization();
            specialization.setName(name);
            specialization.setDescription(description);
            specializationRepository.save(specialization);
        }
    }
}
