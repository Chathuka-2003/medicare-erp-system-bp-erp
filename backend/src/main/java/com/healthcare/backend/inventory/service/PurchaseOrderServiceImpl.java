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

@Service
@RequiredArgsConstructor
@Transactional
public class PurchaseOrderServiceImpl implements PurchaseOrderService {

    private static final String STATUS_PENDING = "PENDING";
    private static final String STATUS_RECEIVED = "RECEIVED";
    private static final String STATUS_CANCELLED = "CANCELLED";

    private static final String MOVEMENT_IN = "IN";

    private final PurchaseOrderRepository purchaseOrderRepository;
    private final SupplierRepository supplierRepository;
    private final ItemRepository itemRepository;
    private final StockMovementRepository stockMovementRepository;

    private static final AtomicInteger SEQUENCE = new AtomicInteger(1);

    @Override
    public PurchaseOrderResponseDto createPurchaseOrder(PurchaseOrderRequestDto requestDto) {
        Supplier supplier = supplierRepository.findById(requestDto.getSupplierId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Supplier not found with id: " + requestDto.getSupplierId()));

        PurchaseOrder po = new PurchaseOrder();
        po.setPurchaseOrderNumber(generatePoNumber());
        po.setOrderDate(requestDto.getOrderDate() != null ? requestDto.getOrderDate() : LocalDate.now());
        po.setExpectedDeliveryDate(requestDto.getExpectedDeliveryDate());
        po.setStatus(STATUS_PENDING);
        po.setSupplier(supplier);

        List<PurchaseOrderItem> items = new ArrayList<>();
        for (PurchaseOrderRequestDto.PurchaseOrderItemDto itemDto : requestDto.getItems()) {
            Item item = itemRepository.findById(itemDto.getItemId())
                    .orElseThrow(() -> new ResourceNotFoundException("Item not found with id: " + itemDto.getItemId()));

            PurchaseOrderItem poItem = new PurchaseOrderItem();
            poItem.setItem(item);
            poItem.setQuantity(itemDto.getQuantity());
            poItem.setUnitPrice(itemDto.getUnitPrice());
            poItem.setTotalPrice(itemDto.getUnitPrice().multiply(BigDecimal.valueOf(itemDto.getQuantity())));
            poItem.setPurchaseOrder(po);
            items.add(poItem);
        }
        po.setItems(items);

        PurchaseOrder saved = purchaseOrderRepository.save(po);
        return toResponseDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public PurchaseOrderResponseDto getPurchaseOrderById(UUID id) {
        return toResponseDto(findPoOrThrow(id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<PurchaseOrderResponseDto> getPurchaseOrdersBySupplier(UUID supplierId) {
        return purchaseOrderRepository.findBySupplierId(supplierId).stream()
                .map(this::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public PurchaseOrderResponseDto receivePurchaseOrder(UUID id) {
        PurchaseOrder po = findPoOrThrow(id);

        if (!STATUS_PENDING.equals(po.getStatus())) {
            throw new BusinessException("Only pending purchase orders can be received");
        }

        for (PurchaseOrderItem poItem : po.getItems()) {
            Item item = poItem.getItem();
            int currentStock = item.getQuantityInStock() != null ? item.getQuantityInStock() : 0;
            item.setQuantityInStock(currentStock + poItem.getQuantity());
            itemRepository.save(item);

            StockMovement movement = new StockMovement();
            movement.setItem(item);
            movement.setQuantity(poItem.getQuantity());
            movement.setMovementType(MOVEMENT_IN);
            movement.setReferenceNumber(po.getPurchaseOrderNumber());
            movement.setRemarks("Received from purchase order " + po.getPurchaseOrderNumber());
            movement.setMovementDate(LocalDateTime.now());
            stockMovementRepository.save(movement);
        }

        po.setStatus(STATUS_RECEIVED);
        PurchaseOrder updated = purchaseOrderRepository.save(po);
        return toResponseDto(updated);
    }

    @Override
    public void cancelPurchaseOrder(UUID id) {
        PurchaseOrder po = findPoOrThrow(id);

        if (STATUS_RECEIVED.equals(po.getStatus())) {
            throw new BusinessException("Cannot cancel a purchase order that has already been received");
        }

        po.setStatus(STATUS_CANCELLED);
        purchaseOrderRepository.save(po);
    }

    private PurchaseOrderResponseDto toResponseDto(PurchaseOrder po) {
        List<PurchaseOrderResponseDto.PurchaseOrderItemDto> itemDtos = po.getItems() == null
                ? List.of()
                : po.getItems().stream()
                .map(item -> PurchaseOrderResponseDto.PurchaseOrderItemDto.builder()
                        .id(item.getId())
                        .itemId(item.getItem() != null ? item.getItem().getId() : null)
                        .itemName(item.getItem() != null ? item.getItem().getItemName() : null)
                        .quantity(item.getQuantity())
                        .unitPrice(item.getUnitPrice())
                        .totalPrice(item.getTotalPrice())
                        .build())
                .collect(Collectors.toList());

        BigDecimal total = itemDtos.stream()
                .map(PurchaseOrderResponseDto.PurchaseOrderItemDto::getTotalPrice)
                .filter(java.util.Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        PurchaseOrderResponseDto.PurchaseOrderResponseDtoBuilder builder = PurchaseOrderResponseDto.builder()
                .id(po.getId())
                .purchaseOrderNumber(po.getPurchaseOrderNumber())
                .orderDate(po.getOrderDate())
                .expectedDeliveryDate(po.getExpectedDeliveryDate())
                .status(po.getStatus())
                .totalAmount(total)
                .items(itemDtos)
                .createdAt(po.getCreatedAt())
                .updatedAt(po.getUpdatedAt());

        if (po.getSupplier() != null) {
            builder.supplierId(po.getSupplier().getId());
            builder.supplierName(po.getSupplier().getSupplierName());
        }

        return builder.build();
    }

    private PurchaseOrder findPoOrThrow(UUID id) {
        return purchaseOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Purchase order not found with id: " + id));
    }

    private synchronized String generatePoNumber() {
        int year = Year.now().getValue();
        int seq = SEQUENCE.getAndIncrement();
        String candidate;
        do {
            candidate = String.format("PO-%d-%05d", year, seq);
            seq = SEQUENCE.getAndIncrement();
        } while (purchaseOrderRepository.existsByPurchaseOrderNumber(candidate));
        return candidate;
    }
}
