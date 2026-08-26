package com.nixtap.engagement.entity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.SQLRestriction;
import java.time.LocalDateTime;

@Entity @Table(name = "lead_capture")
@SQLRestriction("is_deleted = false")
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class LeadCapture {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(name = "card_id", nullable = false) private Long cardId;
    @Column(name = "visitor_name", nullable = false, length = 150) private String visitorName;
    @Column(name = "visitor_email", nullable = false, length = 180) private String visitorEmail;
    @Column(name = "visitor_phone", length = 20) private String visitorPhone;
    @Column(name = "message", columnDefinition = "TEXT") private String message;
    @Column(name = "is_deleted", nullable = false) private Boolean isDeleted = false;
    @CreationTimestamp @Column(name = "created_at", updatable = false) private LocalDateTime createdAt;
}
