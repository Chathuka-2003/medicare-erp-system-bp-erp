package com.healthcare.backend.inventory.mapper;

import com.healthcare.backend.inventory.dto.ItemRequestDto;
import com.healthcare.backend.inventory.dto.ItemResponseDto;
import com.healthcare.backend.inventory.entity.Item;
import com.healthcare.backend.inventory.entity.Supplier;
import org.springframework.stereotype.Component;

@Component
public class InventoryMapper {

    public Item toEntity(ItemRequestDto dto, Supplier supplier) {
        Item item = new Item();
        applyToEntity(item, dto, supplier);
        return item;
    }

    public void applyToEntity(Item item, ItemRequestDto dto, Supplier supplier) {
        item.setItemCode(dto.getItemCode());
        item.setItemName(dto.getItemName());
        item.setCategory(dto.getCategory());
        item.setUnit(dto.getUnit());
        item.setQuantityInStock(dto.getQuantityInStock() != null ? dto.getQuantityInStock() : 0);
        item.setReorderLevel(dto.getReorderLevel());
        item.setPurchasePrice(dto.getPurchasePrice());
        item.setSellingPrice(dto.getSellingPrice());
        item.setStorageLocation(dto.getStorageLocation());
        item.setSupplier(supplier);
    }

    public ItemResponseDto toResponseDto(Item item) {
        boolean belowReorder = item.getReorderLevel() != null
                && item.getQuantityInStock() != null
                && item.getQuantityInStock() <= item.getReorderLevel();

        ItemResponseDto.ItemResponseDtoBuilder builder = ItemResponseDto.builder()
                .id(item.getId())
                .itemCode(item.getItemCode())
                .itemName(item.getItemName())
                .category(item.getCategory())
                .unit(item.getUnit())
                .quantityInStock(item.getQuantityInStock())
                .reorderLevel(item.getReorderLevel())
                .purchasePrice(item.getPurchasePrice())
                .sellingPrice(item.getSellingPrice())
                .storageLocation(item.getStorageLocation())
                .belowReorderLevel(belowReorder)
                .createdAt(item.getCreatedAt())
                .updatedAt(item.getUpdatedAt());

        if (item.getSupplier() != null) {
            builder.supplierId(item.getSupplier().getId());
            builder.supplierName(item.getSupplier().getSupplierName());
        }

        return builder.build();
    }
}
