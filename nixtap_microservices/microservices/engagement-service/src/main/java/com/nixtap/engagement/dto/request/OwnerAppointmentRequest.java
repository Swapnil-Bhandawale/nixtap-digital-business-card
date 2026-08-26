package com.nixtap.engagement.dto.request;

import com.nixtap.engagement.enums.AppointmentStatus;
import jakarta.validation.constraints.Email;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class OwnerAppointmentRequest {

    private String visitorName;

    @Email(message = "Invalid email format")
    private String visitorEmail;

    private String visitorPhone;

    private LocalDateTime requestedDatetime;

    private String message;

    private AppointmentStatus status;
}
