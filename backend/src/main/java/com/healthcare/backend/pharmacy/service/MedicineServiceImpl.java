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

public class MedicineServiceImpl implements MedicineService {

}