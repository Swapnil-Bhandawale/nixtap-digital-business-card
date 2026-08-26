package com.nixtap.analytics.dto.response;
import lombok.*;
import java.util.List;

@Getter @Builder @NoArgsConstructor @AllArgsConstructor
public class AnalyticsResponse {
    private Long cardId;
    private long totalViews;
    private long uniqueVisitors;
    private long totalShares;
    private List<DailyViewCount> viewsByDay;
    private List<ChannelShareCount> sharesByChannel;
    private List<DeviceTypeCount> viewsByDevice;
    private List<TrafficSourceCount> viewsBySource;

    @Getter @Builder @NoArgsConstructor @AllArgsConstructor
    public static class DeviceTypeCount {
        private String device;
        private long count;
    }

    @Getter @Builder @NoArgsConstructor @AllArgsConstructor
    public static class TrafficSourceCount {
        private String source;
        private long count;
    }

    @Getter @Builder @NoArgsConstructor @AllArgsConstructor
    public static class DailyViewCount {
        private String date;
        private long count;
    }

    @Getter @Builder @NoArgsConstructor @AllArgsConstructor
    public static class ChannelShareCount {
        private String channel;
        private long count;
    }
}
