package com.healthcare.backend.inventory.controller;

import com.healthcare.backend.common.dto.ApiResponse;
import com.healthcare.backend.common.dto.PageResponse;
import com.healthcare.backend.inventory.dto.ItemRequestDto;
import com.healthcare.backend.inventory.dto.ItemResponseDto;
import com.healthcare.backend.inventory.service.ItemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/items")
@RequiredArgsConstructor
public class ItemController {

    private final ItemService itemService;

    @PostMapping
    public ResponseEntity<ApiResponse<ItemResponseDto>> createItem(
            @Valid @RequestBody ItemRequestDto requestDto) {
        ItemResponseDto created = itemService.createItem(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Item created successfully", created));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ItemResponseDto>> getItemById(@PathVariable UUID id) {
        ItemResponseDto item = itemService.getItemById(id);
        return ResponseEntity.ok(ApiResponse.success("Item retrieved successfully", item));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<ItemResponseDto>>> getAllItems(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "ASC") String sortDirection) {

        Page<ItemResponseDto> result = itemService.getAllItems(page, size, sortBy, sortDirection);
        return ResponseEntity.ok(ApiResponse.success("Items retrieved successfully", PageResponse.of(result)));
    }

    @GetMapping("/low-stock")
    public ResponseEntity<ApiResponse<List<ItemResponseDto>>> getLowStockItems() {
        List<ItemResponseDto> items = itemService.getLowStockItems();
        return ResponseEntity.ok(ApiResponse.success("Low stock items retrieved successfully", items));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ItemResponseDto>> updateItem(
            @PathVariable UUID id, @Valid @RequestBody ItemRequestDto requestDto) {
        ItemResponseDto updated = itemService.updateItem(id, requestDto);
        return ResponseEntity.ok(ApiResponse.success("Item updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteItem(@PathVariable UUID id) {
        itemService.deleteItem(id);
        return ResponseEntity.ok(ApiResponse.success("Item deleted successfully", null));
    }
}
