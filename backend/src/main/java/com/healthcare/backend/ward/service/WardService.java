package com.healthcare.backend.ward.service;

import com.healthcare.backend.ward.dto.WardRequestDto;
import com.healthcare.backend.ward.dto.WardResponseDto;

import java.util.List;
import java.util.UUID;

public interface WardService {

    WardResponseDto createWard(WardRequestDto requestDto);

    WardResponseDto getWardById(UUID id);

    List<WardResponseDto> getAllWards();

    WardResponseDto updateWard(UUID id, WardRequestDto requestDto);

    void deleteWard(UUID id);
}
