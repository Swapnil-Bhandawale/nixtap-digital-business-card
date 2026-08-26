package com.nixtap.analytics.controller;

import com.nixtap.analytics.dto.response.*;
import com.nixtap.analytics.service.AnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/cards/{cardId}/analytics")
@RequiredArgsConstructor
@Tag(name = "Analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping
    @Operation(summary = "Get analytics for a card — owner only via Gateway")
    public ResponseEntity<ApiResponse<AnalyticsResponse>> getAnalytics(
            @PathVariable Long cardId,
            @RequestParam(defaultValue = "7") int days) {
        return ResponseEntity.ok(ApiResponse.success(
                analyticsService.getAnalytics(cardId, days)));
    }
}
