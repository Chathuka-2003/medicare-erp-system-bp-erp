package com.healthcare.backend.pharmacy.service;

import com.healthcare.backend.common.exception.BusinessException;
import com.healthcare.backend.common.exception.ResourceNotFoundException;
import com.healthcare.backend.pharmacy.dto.MedicineRequestDto;
import com.healthcare.backend.pharmacy.dto.MedicineResponseDto;
import com.healthcare.backend.pharmacy.dto.MedicineStockRequestDto;
import com.healthcare.backend.pharmacy.dto.MedicineStockResponseDto;
import com.healthcare.backend.pharmacy.entity.Medicine;
import com.healthcare.backend.pharmacy.entity.MedicineStock;
import com.healthcare.backend.pharmacy.mapper.MedicineMapper;
import com.healthcare.backend.pharmacy.repository.MedicineRepository;
import com.healthcare.backend.pharmacy.repository.MedicineStockRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class MedicineServiceImpl implements MedicineService {

    private final MedicineRepository medicineRepository;
    private final MedicineStockRepository medicineStockRepository;
    private final MedicineMapper medicineMapper;

    @Override
    public MedicineResponseDto createMedicine(MedicineRequestDto requestDto) {
        if (medicineRepository.existsByMedicineCode(requestDto.getMedicineCode())) {
            throw new BusinessException("A medicine with this code already exists");
        }

        Medicine medicine = medicineMapper.toEntity(requestDto);
        Medicine saved = medicineRepository.save(medicine);
        return medicineMapper.toResponseDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public MedicineResponseDto getMedicineById(UUID id) {
        return medicineMapper.toResponseDto(findMedicineOrThrow(id));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<MedicineResponseDto> getAllMedicines(int page, int size, String sortBy, String sortDirection) {
        Pageable pageable = buildPageable(page, size, sortBy, sortDirection);
        return medicineRepository.findAll(pageable).map(medicineMapper::toResponseDto);
    }

    @Override
    public MedicineResponseDto updateMedicine(UUID id, MedicineRequestDto requestDto) {
        Medicine medicine = findMedicineOrThrow(id);

        if (!requestDto.getMedicineCode().equals(medicine.getMedicineCode())
                && medicineRepository.existsByMedicineCode(requestDto.getMedicineCode())) {
            throw new BusinessException("A medicine with this code already exists");
        }

        medicineMapper.applyToEntity(medicine, requestDto);
        Medicine updated = medicineRepository.save(medicine);
        return medicineMapper.toResponseDto(updated);
    }

    @Override
    public void deleteMedicine(UUID id) {
        Medicine medicine = findMedicineOrThrow(id);
        medicineRepository.delete(medicine);
    }

    @Override
    public MedicineStockResponseDto addStock(UUID medicineId, MedicineStockRequestDto requestDto) {
        Medicine medicine = findMedicineOrThrow(medicineId);

        MedicineStock stock = new MedicineStock();
        stock.setMedicine(medicine);
        stock.setBatchNumber(requestDto.getBatchNumber());
        stock.setQuantityInStock(requestDto.getQuantityInStock());
        stock.setReorderLevel(requestDto.getReorderLevel());
        stock.setManufactureDate(requestDto.getManufactureDate());
        stock.setExpiryDate(requestDto.getExpiryDate());
        stock.setStorageLocation(requestDto.getStorageLocation());

        MedicineStock saved = medicineStockRepository.save(stock);
        return toStockResponseDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MedicineStockResponseDto> getStockByMedicine(UUID medicineId) {
        return medicineStockRepository.findByMedicineId(medicineId).stream()
                .map(this::toStockResponseDto)
                .collect(Collectors.toList());
    }

    private MedicineStockResponseDto toStockResponseDto(MedicineStock stock) {
        return MedicineStockResponseDto.builder()
                .id(stock.getId())
                .batchNumber(stock.getBatchNumber())
                .quantityInStock(stock.getQuantityInStock())
                .reorderLevel(stock.getReorderLevel())
                .manufactureDate(stock.getManufactureDate())
                .expiryDate(stock.getExpiryDate())
                .storageLocation(stock.getStorageLocation())
                .build();
    }

    private Medicine findMedicineOrThrow(UUID id) {
        return medicineRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medicine not found with id: " + id));
    }

    private Pageable buildPageable(int page, int size, String sortBy, String sortDirection) {
        Sort.Direction direction = "DESC".equalsIgnoreCase(sortDirection) ? Sort.Direction.DESC : Sort.Direction.ASC;
        String sortField = (sortBy == null || sortBy.isBlank()) ? "id" : sortBy;
        return PageRequest.of(page, size, Sort.by(direction, sortField));
    }
}