package com.nixtap.analytics.entity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity @Table(name = "profile_views")
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class ProfileView {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(name = "card_id", nullable = false) private Long cardId;
    @Column(name = "visitor_ip", nullable = false, length = 45) private String visitorIp;
    @Column(name = "user_agent", length = 500) private String userAgent;
    @Column(name = "referrer", length = 500) private String referrer;
    @CreationTimestamp @Column(name = "viewed_at", updatable = false) private LocalDateTime viewedAt;
}
