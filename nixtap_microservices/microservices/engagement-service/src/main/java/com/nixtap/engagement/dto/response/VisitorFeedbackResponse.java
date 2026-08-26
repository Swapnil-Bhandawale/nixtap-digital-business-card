package com.nixtap.engagement.dto.response;
import lombok.*;
import java.time.LocalDateTime;

@Getter @Builder @NoArgsConstructor @AllArgsConstructor
public class VisitorFeedbackResponse {
    private Long id;
    private Long cardId;
    private String visitorName;
    private Short rating;
    private String comment;
    private String imageUrl;
    private LocalDateTime createdAt;
}
