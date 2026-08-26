package com.nixtap.auth.controller;

import com.nixtap.auth.dto.response.AdminUserDto;
import com.nixtap.auth.dto.response.ApiResponse;
import com.nixtap.auth.entity.User;
import com.nixtap.auth.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Admin-only user management endpoints.
 * Role check is performed by the API Gateway (JwtAuthFilter sets X-User-Role header).
 * The controller reads X-User-Role and rejects non-ADMIN callers.
 * NOTE: Password hashes are NEVER returned.
 */
@RestController
@RequestMapping("/api/v1/admin/users")
@RequiredArgsConstructor
@Tag(name = "Admin - Users")
public class AdminUserController {

    private final UserRepository userRepository;

    @GetMapping
    @Operation(summary = "List all users — admin only")
    public ResponseEntity<?> listUsers(
            @RequestHeader(value = "X-User-Role", defaultValue = "") String userRole,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String search) {

        if (!"ADMIN".equalsIgnoreCase(userRole)) {
            return ResponseEntity.status(403).body(
                    ApiResponse.error("Admin role required"));
        }

        PageRequest pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<User> userPage;

        if (search != null && !search.isBlank()) {
            userPage = userRepository.findByEmailContainingIgnoreCaseOrFullNameContainingIgnoreCase(
                    search.trim(), search.trim(), pageable);
        } else {
            userPage = userRepository.findAll(pageable);
        }

        List<AdminUserDto> dtos = userPage.getContent().stream()
                .map(u -> AdminUserDto.builder()
                        .id(u.getId())
                        .fullName(u.getFullName())
                        .email(u.getEmail())
                        .phone(u.getPhone())
                        .role(u.getRole())
                        .isActive(u.getIsActive())
                        .isVerified(u.getIsVerified())
                        .createdAt(u.getCreatedAt())
                        .build())
                .toList();

        return ResponseEntity.ok(ApiResponse.success("Users retrieved", new PageResult<>(
                dtos, userPage.getTotalElements(), userPage.getTotalPages(), page, size)));
    }

    record PageResult<T>(List<T> content, long totalElements, int totalPages, int page, int size) {}
}
