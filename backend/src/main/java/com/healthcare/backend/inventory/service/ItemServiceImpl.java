package com.healthcare.backend.inventory.service;

import com.healthcare.backend.common.exception.BusinessException;
import com.healthcare.backend.common.exception.ResourceNotFoundException;
import com.healthcare.backend.inventory.dto.ItemRequestDto;
import com.healthcare.backend.inventory.dto.ItemResponseDto;
import com.healthcare.backend.inventory.entity.Item;
import com.healthcare.backend.inventory.entity.Supplier;
import com.healthcare.backend.inventory.mapper.InventoryMapper;
import com.healthcare.backend.inventory.repository.ItemRepository;
import com.healthcare.backend.inventory.repository.SupplierRepository;
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

public class ItemServiceImpl implements ItemService {

}