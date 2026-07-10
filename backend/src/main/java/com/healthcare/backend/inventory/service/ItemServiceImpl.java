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

@Service
@RequiredArgsConstructor
@Transactional
public class ItemServiceImpl implements ItemService {

    private final ItemRepository itemRepository;
    private final SupplierRepository supplierRepository;
    private final InventoryMapper inventoryMapper;

    @Override
    public ItemResponseDto createItem(ItemRequestDto requestDto) {
        if (itemRepository.existsByItemCode(requestDto.getItemCode())) {
            throw new BusinessException("An item with this code already exists");
        }

        Supplier supplier = requestDto.getSupplierId() != null
                ? findSupplierOrThrow(requestDto.getSupplierId())
                : null;

        Item item = inventoryMapper.toEntity(requestDto, supplier);
        Item saved = itemRepository.save(item);
        return inventoryMapper.toResponseDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public ItemResponseDto getItemById(UUID id) {
        return inventoryMapper.toResponseDto(findItemOrThrow(id));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ItemResponseDto> getAllItems(int page, int size, String sortBy, String sortDirection) {
        Pageable pageable = buildPageable(page, size, sortBy, sortDirection);
        return itemRepository.findAll(pageable).map(inventoryMapper::toResponseDto);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ItemResponseDto> getLowStockItems() {
        return itemRepository.findAll().stream()
                .filter(item -> item.getReorderLevel() != null
                        && item.getQuantityInStock() != null
                        && item.getQuantityInStock() <= item.getReorderLevel())
                .map(inventoryMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public ItemResponseDto updateItem(UUID id, ItemRequestDto requestDto) {
        Item item = findItemOrThrow(id);

        if (!requestDto.getItemCode().equals(item.getItemCode())
                && itemRepository.existsByItemCode(requestDto.getItemCode())) {
            throw new BusinessException("An item with this code already exists");
        }

        Supplier supplier = requestDto.getSupplierId() != null
                ? findSupplierOrThrow(requestDto.getSupplierId())
                : null;

        inventoryMapper.applyToEntity(item, requestDto, supplier);
        Item updated = itemRepository.save(item);
        return inventoryMapper.toResponseDto(updated);
    }

    @Override
    public void deleteItem(UUID id) {
        Item item = findItemOrThrow(id);
        itemRepository.delete(item);
    }

    private Item findItemOrThrow(UUID id) {
        return itemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found with id: " + id));
    }

    private Supplier findSupplierOrThrow(UUID id) {
        return supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found with id: " + id));
    }

    private Pageable buildPageable(int page, int size, String sortBy, String sortDirection) {
        Sort.Direction direction = "DESC".equalsIgnoreCase(sortDirection) ? Sort.Direction.DESC : Sort.Direction.ASC;
        String sortField = (sortBy == null || sortBy.isBlank()) ? "id" : sortBy;
        return PageRequest.of(page, size, Sort.by(direction, sortField));
    }
}
