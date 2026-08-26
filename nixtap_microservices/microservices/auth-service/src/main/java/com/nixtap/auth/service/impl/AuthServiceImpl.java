package com.nixtap.auth.service.impl;

import com.nixtap.auth.dto.request.LoginRequest;
import com.nixtap.auth.dto.request.RegisterRequest;
import com.nixtap.auth.dto.response.AuthResponse;
import com.nixtap.auth.entity.User;
import com.nixtap.auth.enums.AuthProvider;
import com.nixtap.auth.enums.Role;
import com.nixtap.auth.exception.DuplicateResourceException;
import com.nixtap.auth.exception.InvalidCredentialsException;
import com.nixtap.auth.model.AuditLog;
import com.nixtap.auth.repository.AuditLogRepository;
import com.nixtap.auth.repository.UserRepository;
import com.nixtap.auth.security.JwtUtil;
import com.nixtap.auth.service.AuthService;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final AuditLogRepository auditLogRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Override
    @Transactional
    @CircuitBreaker(name = "authService")
    public AuthResponse register(RegisterRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            logAudit("REGISTER_FAILURE", email, "FAILED");
            throw new DuplicateResourceException(
                    "An account with email '" + email + "' already exists");
        }
        User user = User.builder()
                .fullName(request.getFullName().trim())
                .email(email)
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .role(Role.USER)
                .authProvider(AuthProvider.LOCAL)
                .isActive(true)
                .isDeleted(false)
                .build();

        User saved = userRepository.save(user);
        logAudit("REGISTER_SUCCESS", email, "SUCCESS");
        return buildResponse(saved);
    }

    @Override
    @Transactional
    @CircuitBreaker(name = "authService")
    public AuthResponse login(LoginRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            logAudit("LOGIN_FAILURE", email, "FAILED");
            throw new InvalidCredentialsException("Invalid email or password");
        }
        if (!Boolean.TRUE.equals(user.getIsActive())) {
            logAudit("LOGIN_FAILURE_INACTIVE", email, "FAILED");
            throw new InvalidCredentialsException("This account has been deactivated");
        }
        if (!Boolean.TRUE.equals(user.getIsVerified())) {
            logAudit("LOGIN_FAILURE_UNVERIFIED", email, "FAILED");
            throw new InvalidCredentialsException("Account not verified. Please verify your email.");
        }
        logAudit("LOGIN_SUCCESS", email, "SUCCESS");
        return buildResponse(user);
    }

    private void logAudit(String eventType, String username, String status) {
        auditLogRepository.save(AuditLog.builder()
                .eventType(eventType)
                .username(username)
                .timestamp(LocalDateTime.now())
                .status(status)
                .build());
    }

    private AuthResponse buildResponse(User user) {
        return AuthResponse.builder()
                .token(jwtUtil.generateToken(user.getId(), user.getRole().name(), user.getEmail()))
                .tokenType("Bearer")
                .userId(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .expiresInMs(jwtUtil.getExpirationMs())
                .build();
    }
}
