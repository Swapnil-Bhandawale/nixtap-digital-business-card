package com.nixtap.engagement.controller;

import com.nixtap.engagement.dto.request.*;
import com.nixtap.engagement.dto.response.*;
import com.nixtap.engagement.service.EngagementService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/public/cards/{cardId}")
@RequiredArgsConstructor
@Tag(name = "Public Engagement")
public class PublicEngagementController {
    @GetMapping("/feedback")
    @Operation(summary = "Visitor reads feedback for Wall of Love")
    public ResponseEntity<ApiResponse<java.util.List<VisitorFeedbackResponse>>> getPublicFeedback(
            @PathVariable Long cardId) {
        return ResponseEntity.ok(ApiResponse.success(engagementService.getFeedback(cardId)));
    }


    private final EngagementService engagementService;

    @PostMapping("/leads")
    @Operation(summary = "Visitor submits contact — no auth")
    public ResponseEntity<ApiResponse<LeadCaptureResponse>> submitLead(
            @PathVariable Long cardId,
            @Valid @RequestBody LeadCaptureRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Contact received!", engagementService.submitLead(cardId, req)));
    }

    @PostMapping("/appointments")
    @Operation(summary = "Visitor books appointment — no auth")
    public ResponseEntity<ApiResponse<AppointmentResponse>> bookAppointment(
            @PathVariable Long cardId,
            @Valid @RequestBody AppointmentRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Appointment request received!",
                        engagementService.bookAppointment(cardId, req)));
    }

    @PostMapping("/feedback")
    @Operation(summary = "Visitor submits feedback — no auth")
    public ResponseEntity<ApiResponse<VisitorFeedbackResponse>> submitFeedback(
            @PathVariable Long cardId,
            @Valid @RequestBody VisitorFeedbackRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Thank you for your feedback!",
                        engagementService.submitFeedback(cardId, req)));
    }
}
