package com.nixtap.engagement.dto.response;
import com.nixtap.engagement.enums.AppointmentStatus;
import lombok.*;
import java.time.LocalDateTime;

@Getter @Builder @NoArgsConstructor @AllArgsConstructor
public class AppointmentResponse {
    private Long id;
    private Long cardId;
    private String visitorName;
    private String visitorEmail;
    private String visitorPhone;
    private LocalDateTime requestedDatetime;
    private String message;
    private AppointmentStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
