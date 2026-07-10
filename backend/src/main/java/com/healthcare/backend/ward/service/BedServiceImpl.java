package com.healthcare.backend.ward.service;

import com.healthcare.backend.common.exception.BusinessException;
import com.healthcare.backend.common.exception.ResourceNotFoundException;
import com.healthcare.backend.ward.dto.BedRequestDto;
import com.healthcare.backend.ward.dto.BedResponseDto;
import com.healthcare.backend.ward.entity.Bed;
import com.healthcare.backend.ward.entity.Ward;
import com.healthcare.backend.ward.enums.BedStatus;
import com.healthcare.backend.ward.mapper.WardMapper;
import com.healthcare.backend.ward.repository.BedRepository;
import com.healthcare.backend.ward.repository.WardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

public class BedServiceImpl implements BedService {

}