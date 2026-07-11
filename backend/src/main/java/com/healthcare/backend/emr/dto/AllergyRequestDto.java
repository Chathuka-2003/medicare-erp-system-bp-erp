package com.healthcare.backend.emr.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AllergyRequestDto {

    @NotBlank(message = "Allergy name is required")
    private String allergyName;

    private String description;

    private String severity; // e.g. MILD, MODERATE, SEVERE
}
