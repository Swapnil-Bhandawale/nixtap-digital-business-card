package com.nixtap.analytics.controller;

import com.nixtap.analytics.dto.request.*;
import com.nixtap.analytics.dto.response.ApiResponse;
import com.nixtap.analytics.service.AnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/public/cards/{cardId}")
@RequiredArgsConstructor
@Tag(name = "Public Analytics")
public class PublicAnalyticsController {

    private final AnalyticsService analyticsService;

    @PostMapping(value = "/views")
    @Operation(summary = "Record a profile view — no auth")
    public ResponseEntity<ApiResponse<Void>> recordView(
            @PathVariable Long cardId,
            HttpServletRequest httpRequest) {
        String ip = httpRequest.getHeader("X-Forwarded-For");
        if (ip == null || ip.isBlank()) ip = httpRequest.getRemoteAddr();
        
        ProfileViewRequest req = new ProfileViewRequest();
        req.setUserAgent(httpRequest.getHeader("User-Agent"));
        req.setReferrer(httpRequest.getHeader("Referer"));
        
        analyticsService.recordView(cardId, ip, req);
        return ResponseEntity.ok(ApiResponse.success("View recorded", null));
    }

    @PostMapping("/shares")
    @Operation(summary = "Record a card share — no auth")
    public ResponseEntity<ApiResponse<Void>> recordShare(
            @PathVariable Long cardId,
            @Valid @RequestBody CardShareRequest req) {
        analyticsService.recordShare(cardId, req);
        return ResponseEntity.ok(ApiResponse.success("Share recorded", null));
    }
}
