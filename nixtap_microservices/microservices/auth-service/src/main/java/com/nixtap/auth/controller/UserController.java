package com.nixtap.auth.controller;

import com.nixtap.auth.dto.response.ApiResponse;
import com.nixtap.auth.entity.User;
import com.nixtap.auth.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Tag(name = "Users")
public class UserController {

    private final UserRepository userRepository;

    @GetMapping("/me")
    @Operation(summary = "Get current user profile")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getCurrentUser(
            @RequestHeader("X-User-Id") String userIdStr) {
        
        Long userId = Long.parseLong(userIdStr);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if trial is expired
        if ("PRO".equals(user.getPlanType()) && user.getTrialEndDate() != null) {
            if (LocalDateTime.now().isAfter(user.getTrialEndDate())) {
                user.setPlanType("FREE");
                userRepository.save(user);
            }
        }

        Map<String, Object> data = new HashMap<>();
        data.put("id", user.getId());
        data.put("email", user.getEmail());
        data.put("fullName", user.getFullName());
        data.put("phone", user.getPhone());
        data.put("role", user.getRole());
        data.put("authProvider", user.getAuthProvider());
        data.put("planType", user.getPlanType());
        data.put("trialUsed", user.getTrialUsed());
        data.put("trialEndDate", user.getTrialEndDate());
        data.put("avatarBase64", user.getAvatarBase64());

        return ResponseEntity.ok(ApiResponse.success("User fetched successfully", data));
    }

    @PutMapping("/me")
    @Operation(summary = "Update current user profile")
    public ResponseEntity<ApiResponse<Map<String, Object>>> updateCurrentUser(
            @RequestHeader("X-User-Id") String userIdStr,
            @RequestBody Map<String, String> request) {
        
        Long userId = Long.parseLong(userIdStr);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.containsKey("fullName")) {
            user.setFullName(request.get("fullName"));
        }
        if (request.containsKey("phone")) {
            user.setPhone(request.get("phone"));
        }
        if (request.containsKey("avatarBase64")) {
            user.setAvatarBase64(request.get("avatarBase64"));
        }

        userRepository.save(user);
        
        // Re-fetch mapping logic
        Map<String, Object> data = new HashMap<>();
        data.put("id", user.getId());
        data.put("email", user.getEmail());
        data.put("fullName", user.getFullName());
        data.put("phone", user.getPhone());
        data.put("role", user.getRole());
        data.put("authProvider", user.getAuthProvider());
        data.put("planType", user.getPlanType());
        data.put("trialUsed", user.getTrialUsed());
        data.put("trialEndDate", user.getTrialEndDate());
        data.put("avatarBase64", user.getAvatarBase64());

        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", data));
    }

    @PostMapping("/me/start-trial")
    @Operation(summary = "Start a 30-day free trial")
    public ResponseEntity<ApiResponse<Map<String, Object>>> startTrial(
            @RequestHeader("X-User-Id") String userIdStr) {
        
        Long userId = Long.parseLong(userIdStr);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getTrialUsed() != null && user.getTrialUsed()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Trial has already been used"));
        }

        user.setPlanType("PRO");
        user.setTrialUsed(true);
        user.setTrialEndDate(LocalDateTime.now().plusDays(30));
        userRepository.save(user);

        Map<String, Object> data = new HashMap<>();
        data.put("planType", user.getPlanType());
        data.put("trialUsed", user.getTrialUsed());
        data.put("trialEndDate", user.getTrialEndDate());

        return ResponseEntity.ok(ApiResponse.success("30-Day PRO trial started successfully", data));
    }
}
