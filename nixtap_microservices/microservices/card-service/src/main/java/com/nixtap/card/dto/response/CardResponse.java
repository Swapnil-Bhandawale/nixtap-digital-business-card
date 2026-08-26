package com.nixtap.card.dto.response;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Getter @Builder @NoArgsConstructor @AllArgsConstructor
public class CardResponse {
    private Long id;
    private Long userId;
    private Long templateId;
    private String templateName;
    private String publicId;
    private String customSlug;
    private String shareableUrl;
    private String fullName;
    private String jobTitle;
    private String company;
    private String bio;
    private String email;
    private String phone;
    private String profileImageUrl;
    private String coverImageUrl;
    private String theme;
    private Map<String, Object> customFields;
    private Boolean isPrimary;
    private Boolean isPublished;
    private List<SocialLinkResponse> socialLinks;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
