package com.healthcare.backend.inventory.service;

import com.healthcare.backend.common.exception.BusinessException;
import com.healthcare.backend.common.exception.ResourceNotFoundException;
import com.healthcare.backend.inventory.dto.PurchaseOrderRequestDto;
import com.healthcare.backend.inventory.dto.PurchaseOrderResponseDto;
import com.healthcare.backend.inventory.entity.*;
import com.healthcare.backend.inventory.repository.ItemRepository;
import com.healthcare.backend.inventory.repository.PurchaseOrderRepository;
import com.healthcare.backend.inventory.repository.StockMovementRepository;
import com.healthcare.backend.inventory.repository.SupplierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Year;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

public class PurchaseOrderServiceImpl implements PurchaseOrderService {

}