package com.nixtap.auth.service.impl;

import com.nixtap.auth.service.EmailService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.HashMap;
import java.util.Map;

@Service
@Slf4j
public class ResendEmailServiceImpl implements EmailService {

    @Value("${resend.api.key:}")
    private String resendApiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public void sendOtpEmail(String toEmail, String otp, String purpose) {
        if (resendApiKey == null || resendApiKey.isEmpty()) {
            log.warn("Resend API key is not configured. Falling back to console printing OTP: {}", otp);
            return;
        }
        
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(resendApiKey);

            Map<String, Object> body = new HashMap<>();
            body.put("from", "Nixtap <no-reply@nixtap.online>");
            body.put("to", new String[]{toEmail});
            body.put("subject", "Your Nixtap " + purpose + " Code");
            body.put("html", "<h1>Your OTP Code</h1><p>Your OTP code is: <strong>" + otp + "</strong></p><p>This code will expire in 15 minutes.</p>");

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
            
            restTemplate.postForObject("https://api.resend.com/emails", request, String.class);
            log.info("Successfully sent OTP email to {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send email via Resend", e);
        }
    }
}
