package com.nixtap.card.entity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity @Table(name = "card_templates")
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class CardTemplate {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(name = "name", nullable = false, unique = true, length = 80) private String name;
    @Column(name = "description") private String description;
    @Column(name = "preview_image_url") private String previewImageUrl;
    @Column(name = "default_theme_color", nullable = false, length = 100) private String defaultThemeColor;
    @Column(name = "is_active", nullable = false) private Boolean isActive = true;
    @Column(name = "category", length = 50) private String category = "General";
    @Column(name = "is_premium") private Boolean isPremium = false;
    @CreationTimestamp @Column(name = "created_at", updatable = false) private LocalDateTime createdAt;
}
