package com.healthcare.backend.inventory.service;

import com.healthcare.backend.common.exception.ResourceNotFoundException;
import com.healthcare.backend.inventory.dto.SupplierRequestDto;
import com.healthcare.backend.inventory.dto.SupplierResponseDto;
import com.healthcare.backend.inventory.entity.Supplier;
import com.healthcare.backend.inventory.repository.SupplierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;


public class SupplierServiceImpl implements SupplierService {

}