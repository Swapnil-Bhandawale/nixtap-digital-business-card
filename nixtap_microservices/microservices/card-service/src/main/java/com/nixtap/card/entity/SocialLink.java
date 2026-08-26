package com.nixtap.card.entity;

import com.nixtap.card.enums.SocialPlatform;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.SQLRestriction;
import java.time.LocalDateTime;

@Entity @Table(name = "social_links")
@SQLRestriction("is_deleted = false")
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class SocialLink {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "card_id", nullable = false)
    private Card card;

    @Enumerated(EnumType.STRING)
    @Column(name = "platform", nullable = false, length = 20)
    private SocialPlatform platform;

    @Column(name = "url", nullable = false, length = 500) private String url;
    @Column(name = "display_order") private Integer displayOrder = 0;
    @Column(name = "is_deleted", nullable = false) private Boolean isDeleted = false;
    @CreationTimestamp @Column(name = "created_at", updatable = false) private LocalDateTime createdAt;
}
