package com.nixtap.analytics.dto.request;
import com.nixtap.analytics.enums.ShareChannel;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class CardShareRequest {
    @NotNull(message = "Share channel is required")
    private ShareChannel shareChannel;
}
