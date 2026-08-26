package com.nixtap.auth.entity;

import com.nixtap.auth.enums.AuthProvider;
import com.nixtap.auth.enums.Role;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.SQLRestriction;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@SQLRestriction("is_deleted = false")
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "full_name", nullable = false, length = 150)
    private String fullName;

    @Column(name = "email", nullable = false, unique = true, length = 180)
    private String email;

    @Column(name = "password_hash", length = 255)
    private String passwordHash;

    @Column(name = "phone", length = 20)
    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false, length = 20)
    private Role role;

    @Enumerated(EnumType.STRING)
    @Column(name = "auth_provider", nullable = false, length = 20)
    private AuthProvider authProvider;

    @Column(name = "is_active", nullable = false)
    @Builder.Default private Boolean isActive = true;

    @Column(name = "is_verified", nullable = false)
    @Builder.Default private Boolean isVerified = false;

    @Column(name = "otp_hash", length = 255)
    private String otpHash;

    @Column(name = "otp_expires_at")
    private LocalDateTime otpExpiresAt;

    @Column(name = "is_deleted", nullable = false)
    @Builder.Default private Boolean isDeleted = false;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "plan_type", nullable = false, length = 20)
    @Builder.Default private String planType = "FREE";

    @Column(name = "trial_used", nullable = false)
    @Builder.Default private Boolean trialUsed = false;

    @Column(name = "trial_end_date")
    private LocalDateTime trialEndDate;

    @Column(name = "avatar_base64", columnDefinition = "LONGTEXT")
    private String avatarBase64;
}
