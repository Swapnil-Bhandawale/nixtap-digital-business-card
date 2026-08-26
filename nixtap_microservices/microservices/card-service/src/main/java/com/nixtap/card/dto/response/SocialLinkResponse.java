package com.nixtap.card.dto.response;
import com.nixtap.card.enums.SocialPlatform;
import lombok.*;

@Getter @Builder @NoArgsConstructor @AllArgsConstructor
public class SocialLinkResponse {
    private Long id;
    private SocialPlatform platform;
    private String url;
    private Integer displayOrder;
}
