package com.healthcare.backend.ward.service;

import com.healthcare.backend.common.exception.BusinessException;
import com.healthcare.backend.common.exception.ResourceNotFoundException;
import com.healthcare.backend.ward.dto.WardRequestDto;
import com.healthcare.backend.ward.dto.WardResponseDto;
import com.healthcare.backend.ward.entity.Ward;
import com.healthcare.backend.ward.mapper.WardMapper;
import com.healthcare.backend.ward.repository.WardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

public class WardServiceImpl implements WardService {

}