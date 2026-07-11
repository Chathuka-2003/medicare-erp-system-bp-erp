package com.healthcare.backend.ward.dto;

import com.healthcare.backend.ward.enums.BedStatus;
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
public class BedResponseDto {

    private UUID id;
    private String bedNumber;
    private BedStatus status;
    private String roomNumber;

    private UUID wardId;
    private String wardName;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
