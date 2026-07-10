package com.healthcare.backend.config;

import com.healthcare.backend.security.CustomUserDetailsService;
import com.healthcare.backend.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final CustomUserDetailsService userDetailsService;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final CorsConfigurationSource corsConfigurationSource;

    private static final String[] PUBLIC_ENDPOINTS = {
            "/api/v1/auth/login",
            "/error",
            "/swagger-ui/**",
            "/v3/api-docs/**"
    };

    private static final String[] ALL_STAFF_ROLES = {
            "SUPER_ADMIN", "HOSPITAL_ADMIN", "DOCTOR", "NURSE", "PHARMACIST",
            "LAB_TECHNICIAN", "RECEPTIONIST", "CASHIER", "INVENTORY_MANAGER",
            "HR_MANAGER", "ACCOUNTANT"
    };

    private static final String[] PATIENT_ROLES = {
            "SUPER_ADMIN", "HOSPITAL_ADMIN", "RECEPTIONIST", "NURSE", "DOCTOR"
    };

    private static final String[] PATIENT_LOOKUP_ROLES = {
            "SUPER_ADMIN", "HOSPITAL_ADMIN", "DOCTOR", "NURSE", "PHARMACIST",
            "LAB_TECHNICIAN", "RECEPTIONIST", "CASHIER", "INVENTORY_MANAGER",
            "HR_MANAGER", "ACCOUNTANT"
    };

    private static final String[] APPOINTMENT_ROLES = {
            "SUPER_ADMIN", "HOSPITAL_ADMIN", "RECEPTIONIST", "DOCTOR", "NURSE"
    };

    private static final String[] DOCTOR_DIRECTORY_ROLES = {
            "SUPER_ADMIN", "HOSPITAL_ADMIN", "RECEPTIONIST", "NURSE", "DOCTOR", "LAB_TECHNICIAN", "HR_MANAGER"
    };

    private static final String[] STAFF_MANAGEMENT_ROLES = {
            "SUPER_ADMIN", "HOSPITAL_ADMIN", "HR_MANAGER"
    };

    private static final String[] STAFF_LOOKUP_ROLES = {
            "SUPER_ADMIN", "HOSPITAL_ADMIN", "PHARMACIST", "LAB_TECHNICIAN", "HR_MANAGER"
    };

    private static final String[] EMR_ROLES = {
            "SUPER_ADMIN", "HOSPITAL_ADMIN", "DOCTOR", "NURSE"
    };

    private static final String[] BILLING_ROLES = {
            "SUPER_ADMIN", "HOSPITAL_ADMIN", "CASHIER", "ACCOUNTANT"
    };

    private static final String[] PHARMACY_ROLES = {
            "SUPER_ADMIN", "HOSPITAL_ADMIN", "PHARMACIST"
    };

    private static final String[] LABORATORY_ROLES = {
            "SUPER_ADMIN", "HOSPITAL_ADMIN", "LAB_TECHNICIAN", "DOCTOR"
    };

    private static final String[] WARD_ROLES = {
            "SUPER_ADMIN", "HOSPITAL_ADMIN", "NURSE", "DOCTOR"
    };

    private static final String[] INVENTORY_ROLES = {
            "SUPER_ADMIN", "HOSPITAL_ADMIN", "INVENTORY_MANAGER"
    };

    private static final String[] REPORT_ROLES = {
            "SUPER_ADMIN", "HOSPITAL_ADMIN", "ACCOUNTANT"
    };

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(exceptions -> exceptions
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.setStatus(HttpStatus.UNAUTHORIZED.value());
                            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                            response.getWriter().write("{\"success\":false,\"message\":\"Authentication is required\"}");
                        })
                        .accessDeniedHandler((request, response, accessDeniedException) -> {
                            response.setStatus(HttpStatus.FORBIDDEN.value());
                            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                            response.getWriter().write("{\"success\":false,\"message\":\"You do not have permission to access this resource\"}");
                        })
                )
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(PUBLIC_ENDPOINTS).permitAll()
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/api/v1/auth/me").hasAnyRole(ALL_STAFF_ROLES)
                        .requestMatchers("/api/v1/dashboard/**").hasAnyRole(ALL_STAFF_ROLES)
                        .requestMatchers(HttpMethod.GET, "/api/v1/patients", "/api/v1/patients/**", "/api/v1/patients/search/**").hasAnyRole(PATIENT_LOOKUP_ROLES)
                        .requestMatchers("/api/v1/patients", "/api/v1/patients/**").hasAnyRole(PATIENT_ROLES)
                        .requestMatchers("/api/v1/appointments", "/api/v1/appointments/**").hasAnyRole(APPOINTMENT_ROLES)
                        .requestMatchers(HttpMethod.GET, "/api/v1/doctors", "/api/v1/doctors/**").hasAnyRole(DOCTOR_DIRECTORY_ROLES)
                        .requestMatchers("/api/v1/doctors", "/api/v1/doctors/**").hasAnyRole(STAFF_MANAGEMENT_ROLES)
                        .requestMatchers(HttpMethod.GET, "/api/v1/staff", "/api/v1/staff/**").hasAnyRole(STAFF_LOOKUP_ROLES)
                        .requestMatchers("/api/v1/staff", "/api/v1/staff/**").hasAnyRole(STAFF_MANAGEMENT_ROLES)
                        .requestMatchers("/api/v1/departments/**", "/api/v1/specializations/**").hasAnyRole(ALL_STAFF_ROLES)
                        .requestMatchers("/api/v1/medical-records/**", "/api/v1/diagnoses/**", "/api/v1/prescriptions/**").hasAnyRole(EMR_ROLES)
                        .requestMatchers("/api/v1/invoices/**", "/api/v1/payments/**", "/api/v1/insurance-claims/**").hasAnyRole(BILLING_ROLES)
                        .requestMatchers("/api/v1/medicines/**", "/api/v1/drug-dispenses/**").hasAnyRole(PHARMACY_ROLES)
                        .requestMatchers("/api/v1/lab-tests/**", "/api/v1/lab-results/**").hasAnyRole(LABORATORY_ROLES)
                        .requestMatchers("/api/v1/wards/**", "/api/v1/beds/**", "/api/v1/admissions/**").hasAnyRole(WARD_ROLES)
                        .requestMatchers("/api/v1/items/**", "/api/v1/suppliers/**", "/api/v1/purchase-orders/**").hasAnyRole(INVENTORY_ROLES)
                        .requestMatchers("/api/v1/reports/**").hasAnyRole(REPORT_ROLES)
                        .anyRequest().authenticated()
                )
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
