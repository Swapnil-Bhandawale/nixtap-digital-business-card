package com.nixtap.engagement.dto.request;
import jakarta.validation.constraints.*;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class LeadCaptureRequest {
    @NotBlank(message = "Visitor name is required") @Size(max = 150) private String visitorName;
    @NotBlank(message = "Email is required") @Email private String visitorEmail;
    @Size(max = 20) private String visitorPhone;
    private String message;
}
