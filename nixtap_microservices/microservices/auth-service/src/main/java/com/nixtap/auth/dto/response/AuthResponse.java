package com.nixtap.auth.dto.response;
import com.nixtap.auth.enums.Role;
import lombok.*;
@Getter @Builder @NoArgsConstructor @AllArgsConstructor
public class AuthResponse {
    private String token;
    private String tokenType;
    private Long userId;
    private String fullName;
    private String email;
    private Role role;
    private Long expiresInMs;
}
