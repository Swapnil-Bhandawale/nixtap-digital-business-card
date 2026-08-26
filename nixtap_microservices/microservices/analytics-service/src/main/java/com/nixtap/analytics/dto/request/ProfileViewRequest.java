package com.nixtap.analytics.dto.request;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class ProfileViewRequest {
    private String userAgent;
    private String referrer;
}
