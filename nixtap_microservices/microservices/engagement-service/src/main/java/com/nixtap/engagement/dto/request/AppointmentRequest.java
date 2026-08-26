package com.nixtap.engagement.dto.request;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class AppointmentRequest {
    @NotBlank(message = "Visitor name is required") @Size(max = 150) private String visitorName;
    @NotBlank(message = "Email is required") @Email private String visitorEmail;
    @Size(max = 20) private String visitorPhone;
    @NotNull(message = "Requested datetime is required") private LocalDateTime requestedDatetime;
    private String message;
}
