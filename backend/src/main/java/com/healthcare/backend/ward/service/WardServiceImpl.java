package com.healthcare.backend.ward.service;

import com.healthcare.backend.common.exception.BusinessException;
import com.healthcare.backend.common.exception.ResourceNotFoundException;
import com.healthcare.backend.ward.dto.WardRequestDto;
import com.healthcare.backend.ward.dto.WardResponseDto;
import com.healthcare.backend.ward.entity.Ward;
import com.healthcare.backend.ward.entity.Bed;
import com.healthcare.backend.ward.enums.BedStatus;
import com.healthcare.backend.ward.mapper.WardMapper;
import com.healthcare.backend.ward.repository.WardRepository;
import com.healthcare.backend.ward.repository.BedRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class WardServiceImpl implements WardService {

    private final WardRepository wardRepository;
    private final BedRepository bedRepository;
    private final WardMapper wardMapper;

    @Override
    public WardResponseDto createWard(WardRequestDto requestDto) {
        if (wardRepository.existsByWardCode(requestDto.getWardCode())) {
            throw new BusinessException("A ward with this code already exists");
        }

        Ward ward = new Ward();
        ward.setWardCode(requestDto.getWardCode());
        ward.setWardName(requestDto.getWardName());
        ward.setWardType(requestDto.getWardType());
        ward.setTotalBeds(requestDto.getTotalBeds());
        ward.setAvailableBeds(requestDto.getTotalBeds());
        ward.setFloor(requestDto.getFloor());
        ward.setDescription(requestDto.getDescription());

        Ward saved = wardRepository.save(ward);

        if (saved.getTotalBeds() != null && saved.getTotalBeds() > 0) {
            for (int i = 1; i <= saved.getTotalBeds(); i++) {
                Bed bed = new Bed();
                bed.setBedNumber("B" + i);
                bed.setRoomNumber("General");
                bed.setStatus(BedStatus.AVAILABLE);
                bed.setWard(saved);
                bedRepository.save(bed);
            }
        }

        return wardMapper.toResponseDto(saved);
    }

    @Override
    public WardResponseDto getWardById(UUID id) {
        Ward ward = findWardOrThrow(id);
        List<Bed> existingBeds = bedRepository.findByWardId(id);
        int target = ward.getTotalBeds() != null ? ward.getTotalBeds() : 0;
        if (existingBeds.size() < target) {
            int start = existingBeds.size() + 1;
            for (int i = start; i <= target; i++) {
                Bed bed = new Bed();
                bed.setBedNumber("B" + i);
                bed.setRoomNumber("General");
                bed.setStatus(BedStatus.AVAILABLE);
                bed.setWard(ward);
                bedRepository.save(bed);
            }
            // refresh
            ward = findWardOrThrow(id);
        }
        return wardMapper.toResponseDto(ward);
    }

    @Override
    @Transactional(readOnly = true)
    public List<WardResponseDto> getAllWards() {
        return wardRepository.findAll().stream()
                .map(wardMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public WardResponseDto updateWard(UUID id, WardRequestDto requestDto) {
        Ward ward = findWardOrThrow(id);

        if (!requestDto.getWardCode().equals(ward.getWardCode())
                && wardRepository.existsByWardCode(requestDto.getWardCode())) {
            throw new BusinessException("A ward with this code already exists");
        }

        int occupiedOrReserved = ward.getTotalBeds() - ward.getAvailableBeds();
        if (requestDto.getTotalBeds() < occupiedOrReserved) {
            throw new BusinessException(
                    "Cannot reduce total beds below the number currently occupied/reserved: " + occupiedOrReserved);
        }

        int oldTotal = ward.getTotalBeds() != null ? ward.getTotalBeds() : 0;
        int newTotal = requestDto.getTotalBeds() != null ? requestDto.getTotalBeds() : 0;

        ward.setWardCode(requestDto.getWardCode());
        ward.setWardName(requestDto.getWardName());
        ward.setWardType(requestDto.getWardType());
        ward.setAvailableBeds(requestDto.getTotalBeds() - occupiedOrReserved);
        ward.setTotalBeds(requestDto.getTotalBeds());
        ward.setFloor(requestDto.getFloor());
        ward.setDescription(requestDto.getDescription());

        Ward updated = wardRepository.save(ward);

        if (newTotal > oldTotal) {
            for (int i = oldTotal + 1; i <= newTotal; i++) {
                Bed bed = new Bed();
                bed.setBedNumber("B" + i);
                bed.setRoomNumber("General");
                bed.setStatus(BedStatus.AVAILABLE);
                bed.setWard(updated);
                bedRepository.save(bed);
            }
        }

        return wardMapper.toResponseDto(updated);
    }

    @Override
    public void deleteWard(UUID id) {
        Ward ward = findWardOrThrow(id);
        wardRepository.delete(ward);
    }

    private Ward findWardOrThrow(UUID id) {
        return wardRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ward not found with id: " + id));
    }
}
