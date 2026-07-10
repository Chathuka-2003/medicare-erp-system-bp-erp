package com.healthcare.backend.security;

import com.healthcare.backend.common.dto.ApiResponse;
import com.healthcare.backend.common.exception.BusinessException;
import com.healthcare.backend.staff.entity.Staff;
import com.healthcare.backend.staff.repository.StaffRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final StaffRepository staffRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponseDto>> login(@Valid @RequestBody LoginRequestDto requestDto) {
        Staff staff = staffRepository.findByEmail(requestDto.getEmail())
                .orElseThrow(() -> new BusinessException("Invalid email or password"));

        if (!staff.isActive()) {
            throw new BusinessException("This account has been deactivated");
        }

        if (!passwordEncoder.matches(requestDto.getPassword(), staff.getPassword())) {
            throw new BusinessException("Invalid email or password");
        }

        String token = jwtTokenProvider.generateToken(staff);

        LoginResponseDto response = LoginResponseDto.builder()
                .token(token)
                .staffId(staff.getId())
                .firstName(staff.getFirstName())
                .lastName(staff.getLastName())
                .email(staff.getEmail())
                .role(staff.getRole())
                .build();

        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<LoginResponseDto>> getCurrentUser(
            @RequestHeader("Authorization") String authHeader) {

        String token = authHeader.replace("Bearer ", "");
        String email = jwtTokenProvider.getEmailFromToken(token);

        Staff staff = staffRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException("Staff account not found"));

        LoginResponseDto response = LoginResponseDto.builder()
                .staffId(staff.getId())
                .firstName(staff.getFirstName())
                .lastName(staff.getLastName())
                .email(staff.getEmail())
                .role(staff.getRole())
                .build();

        return ResponseEntity.ok(ApiResponse.success("Current user retrieved successfully", response));
    }
}