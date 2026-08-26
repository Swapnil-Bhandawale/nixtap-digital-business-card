package com.nixtap.engagement.dto.request;
import jakarta.validation.constraints.*;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class VisitorFeedbackRequest {
    @Size(max = 150) private String visitorName;
    @NotNull(message = "Rating is required") @Min(1) @Max(5) private Short rating;
    private String comment;
    private String imageUrl;
}
