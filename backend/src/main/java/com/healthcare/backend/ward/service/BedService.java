package com.healthcare.backend.ward.service;

import com.healthcare.backend.ward.dto.BedRequestDto;
import com.healthcare.backend.ward.dto.BedResponseDto;
import com.healthcare.backend.ward.enums.BedStatus;

import java.util.List;
import java.util.UUID;

public interface BedService {

    BedResponseDto createBed(BedRequestDto requestDto);

    BedResponseDto getBedById(UUID id);

    List<BedResponseDto> getBedsByWard(UUID wardId);

    List<BedResponseDto> getAvailableBeds(UUID wardId);

    BedResponseDto updateBedStatus(UUID id, BedStatus status);

    void deleteBed(UUID id);
}
