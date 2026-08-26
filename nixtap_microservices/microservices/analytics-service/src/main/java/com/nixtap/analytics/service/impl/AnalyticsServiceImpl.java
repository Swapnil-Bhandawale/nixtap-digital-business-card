package com.nixtap.analytics.service.impl;

import com.nixtap.analytics.dto.request.*;
import com.nixtap.analytics.dto.response.AnalyticsResponse;
import com.nixtap.analytics.entity.*;
import com.nixtap.analytics.repository.*;
import com.nixtap.analytics.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsServiceImpl implements AnalyticsService {

    private final ProfileViewRepository viewRepo;
    private final CardShareRepository shareRepo;

    @Override
    @Transactional
    public void recordView(Long cardId, String visitorIp, ProfileViewRequest req) {
        // Store every raw hit — uniqueness is derived at query time, never stored
        ProfileView view = ProfileView.builder()
                .cardId(cardId)
                .visitorIp(visitorIp != null ? visitorIp : "unknown")
                .userAgent(req != null ? req.getUserAgent() : null)
                .referrer(req != null ? req.getReferrer() : null)
                .build();
        viewRepo.save(view);
    }

    @Override
    @Transactional
    public void recordShare(Long cardId, CardShareRequest req) {
        CardShare share = CardShare.builder()
                .cardId(cardId)
                .shareChannel(req.getShareChannel())
                .build();
        shareRepo.save(share);
    }

    @Override
    @Transactional(readOnly = true)
    public AnalyticsResponse getAnalytics(Long cardId, int days) {
        long totalViews    = viewRepo.countByCardId(cardId);
        long uniqueVisitors = viewRepo.countUniqueVisitorsByCardId(cardId);
        long totalShares   = shareRepo.countByCardId(cardId);

        // Views per day
        List<AnalyticsResponse.DailyViewCount> viewsByDay =
            viewRepo.findViewsByDay(cardId, days).stream()
                .map(row -> AnalyticsResponse.DailyViewCount.builder()
                        .date(row[0].toString())
                        .count(((Number) row[1]).longValue())
                        .build())
                .collect(Collectors.toList());

        // Shares by channel
        List<AnalyticsResponse.ChannelShareCount> sharesByChannel =
            shareRepo.findSharesByChannel(cardId).stream()
                .map(row -> AnalyticsResponse.ChannelShareCount.builder()
                        .channel(row[0].toString())
                        .count(((Number) row[1]).longValue())
                        .build())
                .collect(Collectors.toList());

        // Views by device
        List<AnalyticsResponse.DeviceTypeCount> viewsByDevice =
            viewRepo.findViewsByDevice(cardId).stream()
                .map(row -> AnalyticsResponse.DeviceTypeCount.builder()
                        .device(row[0].toString())
                        .count(((Number) row[1]).longValue())
                        .build())
                .collect(Collectors.toList());

        // Views by source
        List<AnalyticsResponse.TrafficSourceCount> viewsBySource =
            viewRepo.findViewsBySource(cardId).stream()
                .map(row -> AnalyticsResponse.TrafficSourceCount.builder()
                        .source(row[0].toString())
                        .count(((Number) row[1]).longValue())
                        .build())
                .collect(Collectors.toList());

        return AnalyticsResponse.builder()
                .cardId(cardId)
                .totalViews(totalViews)
                .uniqueVisitors(uniqueVisitors)
                .totalShares(totalShares)
                .viewsByDay(viewsByDay)
                .sharesByChannel(sharesByChannel)
                .viewsByDevice(viewsByDevice)
                .viewsBySource(viewsBySource)
                .build();
    }
}
