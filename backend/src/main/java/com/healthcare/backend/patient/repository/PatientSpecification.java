package com.healthcare.backend.patient.repository;

import com.healthcare.backend.patient.dto.PatientSearchDto;
import com.healthcare.backend.patient.entity.Patient;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class PatientSpecification {

    public static Specification<Patient> withFilters(PatientSearchDto search) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (search.getPatientNumber() != null && !search.getPatientNumber().isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("patientNumber")),
                        "%" + search.getPatientNumber().toLowerCase() + "%"));
            }
            if (search.getFirstName() != null && !search.getFirstName().isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("firstName")),
                        "%" + search.getFirstName().toLowerCase() + "%"));
            }
            if (search.getLastName() != null && !search.getLastName().isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("lastName")),
                        "%" + search.getLastName().toLowerCase() + "%"));
            }
            if (search.getNic() != null && !search.getNic().isBlank()) {
                predicates.add(cb.equal(root.get("nic"), search.getNic()));
            }
            if (search.getPhone() != null && !search.getPhone().isBlank()) {
                predicates.add(cb.like(root.get("phone"), "%" + search.getPhone() + "%"));
            }
            if (search.getEmail() != null && !search.getEmail().isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("email")),
                        "%" + search.getEmail().toLowerCase() + "%"));
            }
            if (search.getGender() != null) {
                predicates.add(cb.equal(root.get("gender"), search.getGender()));
            }
            if (search.getBloodGroup() != null) {
                predicates.add(cb.equal(root.get("bloodGroup"), search.getBloodGroup()));
            }
            if (search.getDobFrom() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("dateOfBirth"), search.getDobFrom()));
            }
            if (search.getDobTo() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("dateOfBirth"), search.getDobTo()));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}