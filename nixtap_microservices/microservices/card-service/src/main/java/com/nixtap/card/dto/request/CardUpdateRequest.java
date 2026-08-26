package com.nixtap.card.dto.request;
import jakarta.validation.constraints.*;
import lombok.*;
import java.util.Map;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class CardUpdateRequest {
    @Size(max = 150) private String fullName;
    @Size(max = 120) private String jobTitle;
    @Size(max = 120) private String company;
    private String bio;
    @Email private String email;
    @Size(max = 20) private String phone;

    @Pattern(regexp = "^[a-z0-9-]{3,60}$",
             message = "Slug must be 3-60 chars: lowercase letters, numbers, hyphens only")
    private String customSlug;

    private String theme;

    private String profileImageUrl;
    private String coverImageUrl;
    private Map<String, Object> customFields;
    private Boolean isPublished;
}
