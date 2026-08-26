package com.nixtap.engagement.dto.request;
import com.nixtap.engagement.enums.AppointmentStatus;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class AppointmentStatusRequest {
    @NotNull(message = "Status is required") private AppointmentStatus status;
}
