package com.nixtap.card.dto.request;
import com.nixtap.card.enums.SocialPlatform;
import jakarta.validation.constraints.*;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class SocialLinkRequest {
    @NotNull(message = "Platform is required")
    private SocialPlatform platform;

    @NotBlank(message = "URL is required")
    @Size(max = 500)
    private String url;

    private Integer displayOrder = 0;
}
