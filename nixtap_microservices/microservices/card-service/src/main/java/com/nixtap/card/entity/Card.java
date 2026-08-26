package com.nixtap.card.entity;

import jakarta.persistence.*;
import jakarta.persistence.Table;
import lombok.*;
import org.hibernate.annotations.*;
import java.time.LocalDateTime;
import java.util.Map;

@Entity @Table(name = "cards")
@SQLRestriction("is_deleted = false")
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class Card {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;

    @Column(name = "user_id", nullable = false) private Long userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "template_id", nullable = false)
    private CardTemplate template;

    @Column(name = "theme", length = 255) private String theme;
    @Column(name = "custom_slug", unique = true, length = 60) private String customSlug;
    @Column(name = "public_id", nullable = false, unique = true, length = 20) private String publicId;
    @Column(name = "full_name", nullable = false, length = 150) private String fullName;
    @Column(name = "job_title", length = 120) private String jobTitle;
    @Column(name = "company", length = 120) private String company;
    @Column(name = "bio", columnDefinition = "TEXT") private String bio;
    @Column(name = "email", length = 180) private String email;
    @Column(name = "phone", length = 20) private String phone;
    @Column(name = "profile_image_url", length = 500) private String profileImageUrl;
    @Column(name = "cover_image_url", length = 500) private String coverImageUrl;

    @JdbcTypeCode(org.hibernate.type.SqlTypes.JSON)
    @Column(name = "custom_fields", columnDefinition = "json")
    private Map<String, Object> customFields;

    @Column(name = "is_primary", nullable = false) private Boolean isPrimary = false;
    @Column(name = "is_published", nullable = false) private Boolean isPublished = true;
    @Column(name = "is_deleted", nullable = false) private Boolean isDeleted = false;
    @Column(name = "deleted_at") private LocalDateTime deletedAt;

    @CreationTimestamp @Column(name = "created_at", updatable = false) private LocalDateTime createdAt;
    @UpdateTimestamp @Column(name = "updated_at") private LocalDateTime updatedAt;
}
