package com.healthcare.backend.inventory.service;

import com.healthcare.backend.inventory.dto.ItemRequestDto;
import com.healthcare.backend.inventory.dto.ItemResponseDto;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.UUID;

public interface ItemService {

    ItemResponseDto createItem(ItemRequestDto requestDto);

    ItemResponseDto getItemById(UUID id);

    Page<ItemResponseDto> getAllItems(int page, int size, String sortBy, String sortDirection);

    List<ItemResponseDto> getLowStockItems();

    ItemResponseDto updateItem(UUID id, ItemRequestDto requestDto);

    void deleteItem(UUID id);
}
