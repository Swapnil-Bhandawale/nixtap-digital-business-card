package com.nixtap.engagement.dto.response;
import lombok.*;
import java.time.LocalDateTime;

@Getter @Builder @NoArgsConstructor @AllArgsConstructor
public class LeadCaptureResponse {
    private Long id;
    private Long cardId;
    private String visitorName;
    private String visitorEmail;
    private String visitorPhone;
    private String message;
    private LocalDateTime createdAt;
}
