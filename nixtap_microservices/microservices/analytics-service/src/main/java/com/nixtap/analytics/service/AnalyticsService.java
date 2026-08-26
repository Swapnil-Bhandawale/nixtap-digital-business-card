package com.nixtap.analytics.service;
import com.nixtap.analytics.dto.request.*;
import com.nixtap.analytics.dto.response.AnalyticsResponse;

public interface AnalyticsService {
    void recordView(Long cardId, String visitorIp, ProfileViewRequest request);
    void recordShare(Long cardId, CardShareRequest request);
    AnalyticsResponse getAnalytics(Long cardId, int days);
}
