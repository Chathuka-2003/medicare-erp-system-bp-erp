package com.healthcare.backend.pharmacy.controller;

import com.healthcare.backend.common.dto.ApiResponse;
import com.healthcare.backend.pharmacy.dto.DrugDispenseRequestDto;
import com.healthcare.backend.pharmacy.dto.DrugDispenseResponseDto;
import com.healthcare.backend.pharmacy.service.DrugDispenseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/drug-dispenses")
@RequiredArgsConstructor
public class DrugDispenseController {