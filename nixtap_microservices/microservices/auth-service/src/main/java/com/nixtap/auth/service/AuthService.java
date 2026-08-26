package com.nixtap.auth.service;

import com.nixtap.auth.dto.request.LoginRequest;
import com.nixtap.auth.dto.request.RegisterRequest;
import com.nixtap.auth.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}
