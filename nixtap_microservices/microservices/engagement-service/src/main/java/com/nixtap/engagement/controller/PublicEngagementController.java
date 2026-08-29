package com.nixtap.engagement.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nixtap.engagement.dto.request.*;
import com.nixtap.engagement.dto.response.*;
import com.nixtap.engagement.service.EngagementService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/public/cards/{cardId}")
@RequiredArgsConstructor
@Tag(name = "Public Engagement")
public class PublicEngagementController {

    private final EngagementService engagementService;
    private final ObjectMapper mapper = new ObjectMapper()
            .registerModule(new com.fasterxml.jackson.datatype.jsr310.JavaTimeModule())
            .disable(com.fasterxml.jackson.databind.SerializationFeature.WRITE_DATES_AS_TIMESTAMPS)
            .disable(com.fasterxml.jackson.databind.DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);

    @GetMapping("/feedback")
    @Operation(summary = "Visitor reads feedback for Wall of Love")
    public ResponseEntity<ApiResponse<java.util.List<VisitorFeedbackResponse>>> getPublicFeedback(
            @PathVariable Long cardId) {
        return ResponseEntity.ok(ApiResponse.success("Feedback fetched", engagementService.getPublicFeedback(cardId)));
    }
    
    private String getBody(HttpServletRequest request) throws Exception {
        return request.getReader().lines().collect(Collectors.joining(System.lineSeparator()));
    }

    @PostMapping(value = "/leads")
    @Operation(summary = "Visitor submits contact — no auth")
    public ResponseEntity<ApiResponse<LeadCaptureResponse>> submitLead(
            @PathVariable Long cardId,
            HttpServletRequest request) throws Exception {
        String body = getBody(request);
        LeadCaptureRequest req = body == null || body.isBlank() ? new LeadCaptureRequest() : mapper.readValue(body, LeadCaptureRequest.class);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Contact received!", engagementService.submitLead(cardId, req)));
    }

    @PostMapping(value = "/appointments")
    @Operation(summary = "Visitor books appointment — no auth")
    public ResponseEntity<ApiResponse<AppointmentResponse>> bookAppointment(
            @PathVariable Long cardId,
            HttpServletRequest request) throws Exception {
        String body = getBody(request);
        AppointmentRequest req = body == null || body.isBlank() ? new AppointmentRequest() : mapper.readValue(body, AppointmentRequest.class);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Appointment request received!",
                        engagementService.bookAppointment(cardId, req)));
    }

    @PostMapping(value = "/feedback")
    @Operation(summary = "Visitor submits feedback — no auth")
    public ResponseEntity<ApiResponse<VisitorFeedbackResponse>> submitFeedback(
            @PathVariable Long cardId,
            HttpServletRequest request) throws Exception {
        String body = getBody(request);
        VisitorFeedbackRequest req = body == null || body.isBlank() ? new VisitorFeedbackRequest() : mapper.readValue(body, VisitorFeedbackRequest.class);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Thank you for your feedback!",
                        engagementService.submitFeedback(cardId, req)));
    }
}
