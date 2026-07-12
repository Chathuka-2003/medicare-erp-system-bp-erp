package com.healthcare.backend.ward.service;

import com.healthcare.backend.common.exception.BusinessException;
import com.healthcare.backend.common.exception.ResourceNotFoundException;
import com.healthcare.backend.ward.dto.BedRequestDto;
import com.healthcare.backend.ward.dto.BedResponseDto;
import com.healthcare.backend.ward.entity.Bed;
import com.healthcare.backend.ward.entity.Ward;
import com.healthcare.backend.ward.enums.BedStatus;
import com.healthcare.backend.ward.mapper.WardMapper;
import com.healthcare.backend.ward.repository.BedRepository;
import com.healthcare.backend.ward.repository.WardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class BedServiceImpl implements BedService {

    private final BedRepository bedRepository;
    private final WardRepository wardRepository;
    private final WardMapper wardMapper;

    @Override
    public BedResponseDto createBed(BedRequestDto requestDto) {
        Ward ward = findWardOrThrow(requestDto.getWardId());

        long existingBeds = bedRepository.findByWardId(ward.getId()).size();
        if (existingBeds >= ward.getTotalBeds()) {
            throw new BusinessException("Ward has reached its configured total bed capacity");
        }

        Bed bed = new Bed();
        bed.setBedNumber(requestDto.getBedNumber());
        bed.setRoomNumber(requestDto.getRoomNumber());
        bed.setStatus(requestDto.getStatus() != null ? requestDto.getStatus() : BedStatus.AVAILABLE);
        bed.setWard(ward);

        Bed saved = bedRepository.save(bed);

        if (saved.getStatus() == BedStatus.AVAILABLE) {
            ward.setAvailableBeds(ward.getAvailableBeds() + 1);
            wardRepository.save(ward);
        }

        return wardMapper.toResponseDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public BedResponseDto getBedById(UUID id) {
        return wardMapper.toResponseDto(findBedOrThrow(id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<BedResponseDto> getBedsByWard(UUID wardId) {
        return bedRepository.findByWardId(wardId).stream()
                .map(wardMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<BedResponseDto> getAvailableBeds(UUID wardId) {
        return bedRepository.findByWardIdAndStatus(wardId, BedStatus.AVAILABLE).stream()
                .map(wardMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public BedResponseDto updateBedStatus(UUID id, BedStatus newStatus) {
        Bed bed = findBedOrThrow(id);
        BedStatus oldStatus = bed.getStatus();

        bed.setStatus(newStatus);
        Bed updated = bedRepository.save(bed);

        adjustWardAvailability(bed.getWard(), oldStatus, newStatus);

        return wardMapper.toResponseDto(updated);
    }

    @Override
    public void deleteBed(UUID id) {
        Bed bed = findBedOrThrow(id);
        Ward ward = bed.getWard();

        bedRepository.delete(bed);

        if (ward != null && bed.getStatus() == BedStatus.AVAILABLE) {
            ward.setAvailableBeds(Math.max(0, ward.getAvailableBeds() - 1));
            wardRepository.save(ward);
        }
    }

    /**
     * Keeps Ward.availableBeds in sync whenever a bed transitions in or out of AVAILABLE.
     */
    private void adjustWardAvailability(Ward ward, BedStatus oldStatus, BedStatus newStatus) {
        if (ward == null || oldStatus == newStatus) return;

        boolean wasAvailable = oldStatus == BedStatus.AVAILABLE;
        boolean isAvailable = newStatus == BedStatus.AVAILABLE;

        if (wasAvailable && !isAvailable) {
            ward.setAvailableBeds(Math.max(0, ward.getAvailableBeds() - 1));
            wardRepository.save(ward);
        } else if (!wasAvailable && isAvailable) {
            ward.setAvailableBeds(ward.getAvailableBeds() + 1);
            wardRepository.save(ward);
        }
    }

    private Bed findBedOrThrow(UUID id) {
        return bedRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bed not found with id: " + id));
    }

    private Ward findWardOrThrow(UUID id) {
        return wardRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ward not found with id: " + id));
    }
}
