package com.healthcare.backend.security;

import com.healthcare.backend.common.enums.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponseDto {

    private String token;
    private UUID staffId;
    private String firstName;
    private String lastName;
    private String email;
    private UserRole role;
}