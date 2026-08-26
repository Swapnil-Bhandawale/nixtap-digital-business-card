package com.nixtap.auth.service;

import com.nixtap.auth.dto.request.VerifyOtpRequest;
import com.nixtap.auth.dto.request.ResendOtpRequest;
import com.nixtap.auth.dto.request.ForgotPasswordRequest;
import com.nixtap.auth.dto.request.ResetPasswordRequest;

public interface OtpService {
    void sendRegistrationOtp(String email);
    void verifyOtp(VerifyOtpRequest request);
    void resendOtp(ResendOtpRequest request);
    void sendForgotPasswordOtp(ForgotPasswordRequest request);
    void resetPassword(ResetPasswordRequest request);
}
