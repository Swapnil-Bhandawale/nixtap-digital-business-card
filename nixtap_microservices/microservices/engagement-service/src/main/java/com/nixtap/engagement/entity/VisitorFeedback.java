package com.nixtap.engagement.entity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.SQLRestriction;
import java.time.LocalDateTime;

@Entity @Table(name = "visitor_feedback")
@SQLRestriction("is_deleted = false")
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class VisitorFeedback {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(name = "card_id", nullable = false) private Long cardId;
    @Column(name = "visitor_name", length = 150) private String visitorName;
    @Column(name = "rating", nullable = false) private Short rating;
    @Column(name = "comment", columnDefinition = "TEXT") private String comment;
    @Column(name = "image_url", columnDefinition = "LONGTEXT") private String imageUrl;
    @Column(name = "is_deleted", nullable = false) private Boolean isDeleted = false;
    @CreationTimestamp @Column(name = "created_at", updatable = false) private LocalDateTime createdAt;
}
