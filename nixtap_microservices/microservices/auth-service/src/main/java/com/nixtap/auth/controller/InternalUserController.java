package com.nixtap.auth.controller;

import com.nixtap.auth.entity.User;
import com.nixtap.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.Data;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/internal/users")
@RequiredArgsConstructor
public class InternalUserController {

    private final UserRepository userRepository;

    @Data
    public static class SyncPlanRequest {
        private String planType;
    }

    @PatchMapping("/{userId}/plan")
    public ResponseEntity<?> syncUserPlan(@PathVariable Long userId, @RequestBody SyncPlanRequest request) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        
        user.setPlanType(request.getPlanType());
        userRepository.save(user);
        
        return ResponseEntity.ok().build();
    }
}
