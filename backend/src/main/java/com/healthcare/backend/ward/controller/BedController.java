package com.healthcare.backend.ward.controller;

import com.healthcare.backend.common.dto.ApiResponse;
import com.healthcare.backend.ward.dto.BedRequestDto;
import com.healthcare.backend.ward.dto.BedResponseDto;
import com.healthcare.backend.ward.enums.BedStatus;
import com.healthcare.backend.ward.service.BedService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

public class BedController {

}