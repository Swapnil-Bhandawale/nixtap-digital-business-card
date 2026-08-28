package com.nixtap.auth.service.impl;

import com.nixtap.auth.dto.request.*;
import com.nixtap.auth.entity.User;
import com.nixtap.auth.repository.UserRepository;
import com.nixtap.auth.service.EmailService;
import com.nixtap.auth.service.OtpService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class OtpServiceImpl implements OtpService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final SecureRandom secureRandom = new SecureRandom();

    private String generateOtp() {
        return String.format("%06d", secureRandom.nextInt(1000000));
    }

    @Override
    @Transactional
    public void sendRegistrationOtp(String email) {
        User user = userRepository.findByEmail(email.toLowerCase())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        String otp = generateOtp();
        user.setOtpHash(passwordEncoder.encode(otp));
        user.setOtpExpiresAt(LocalDateTime.now().plusMinutes(15));
        userRepository.save(user);
        
        // In dev mode, we need to return this to the frontend.
        // For now, assume this is handled in a way that doesn't expose it to production logs.
        System.out.println("DEV OTP for " + email + ": " + otp);
        emailService.sendOtpEmail(email, otp, "Login/Registration");
    }

    @Override
    @Transactional
    public void verifyOtp(VerifyOtpRequest request) {
        User user = userRepository.findByEmail(request.getEmail().toLowerCase())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (user.getOtpExpiresAt() == null || user.getOtpExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP expired");
        }
        
        if (!passwordEncoder.matches(request.getOtp(), user.getOtpHash())) {
            throw new RuntimeException("Invalid OTP");
        }
        
        user.setIsVerified(true);
        user.setOtpHash(null);
        user.setOtpExpiresAt(null);
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void resendOtp(ResendOtpRequest request) {
        sendRegistrationOtp(request.getEmail());
    }

    @Override
    @Transactional
    public void sendForgotPasswordOtp(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail().toLowerCase())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        String otp = generateOtp();
        user.setOtpHash(passwordEncoder.encode(otp));
        user.setOtpExpiresAt(LocalDateTime.now().plusMinutes(15));
        userRepository.save(user);
        System.out.println("DEV Forgot Password OTP for " + request.getEmail() + ": " + otp);
        emailService.sendOtpEmail(request.getEmail(), otp, "Password Reset");
    }

    @Override
    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail().toLowerCase())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (user.getOtpExpiresAt() == null || user.getOtpExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP expired");
        }
        
        if (!passwordEncoder.matches(request.getOtp(), user.getOtpHash())) {
            throw new RuntimeException("Invalid OTP");
        }
        
        user.setIsVerified(true);
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        user.setOtpHash(null);
        user.setOtpExpiresAt(null);
        userRepository.save(user);
    }
}


