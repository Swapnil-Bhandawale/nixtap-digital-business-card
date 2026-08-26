package com.nixtap.auth.dto.response;

import com.nixtap.auth.enums.Role;
import lombok.*;
import java.time.LocalDateTime;

@Getter @Builder @NoArgsConstructor @AllArgsConstructor
public class AdminUserDto {
    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private Role role;
    private Boolean isActive;
    private Boolean isVerified;
    private LocalDateTime createdAt;
}
