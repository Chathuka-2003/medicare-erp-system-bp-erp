package com.healthcare.backend.ward.dto;

import com.healthcare.backend.ward.enums.WardType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WardResponseDto {

    private UUID id;
    private String wardCode;
    private String wardName;
    private WardType wardType;
    private Integer totalBeds;
    private Integer availableBeds;
    private String floor;
    private String description;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
