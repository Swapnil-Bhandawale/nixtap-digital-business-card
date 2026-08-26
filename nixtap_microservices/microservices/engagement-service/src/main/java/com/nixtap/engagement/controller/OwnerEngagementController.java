package com.nixtap.engagement.controller;

import com.nixtap.engagement.dto.request.AppointmentStatusRequest;
import com.nixtap.engagement.dto.response.*;
import com.nixtap.engagement.service.EngagementService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/cards/{cardId}")
@RequiredArgsConstructor
@Tag(name = "Owner Engagement")
public class OwnerEngagementController {

    private final EngagementService engagementService;

    @GetMapping("/leads")
    @Operation(summary = "Get leads for my card")
    public ResponseEntity<ApiResponse<List<LeadCaptureResponse>>> getLeads(
            @PathVariable Long cardId) {
        return ResponseEntity.ok(ApiResponse.success(engagementService.getLeads(cardId)));
    }

    @GetMapping("/appointments")
    @Operation(summary = "Get appointments for my card")
    public ResponseEntity<ApiResponse<List<AppointmentResponse>>> getAppointments(
            @PathVariable Long cardId) {
        return ResponseEntity.ok(ApiResponse.success(engagementService.getAppointments(cardId)));
    }

    // Removed updateStatus, updateAppointment handles partial status updates seamlessly for the frontend.
    
    @PostMapping("/appointments")
    @Operation(summary = "Create an appointment manually")
    public ResponseEntity<ApiResponse<AppointmentResponse>> createAppointment(
            @PathVariable Long cardId,
            @Valid @RequestBody com.nixtap.engagement.dto.request.OwnerAppointmentRequest req) {
        return ResponseEntity.status(org.springframework.http.HttpStatus.CREATED)
                .body(ApiResponse.success("Appointment created", 
                engagementService.createAppointment(cardId, req)));
    }
    
    @PutMapping("/appointments/{apptId}")
    @Operation(summary = "Update full appointment details")
    public ResponseEntity<ApiResponse<AppointmentResponse>> updateAppointment(
            @PathVariable Long cardId,
            @PathVariable Long apptId,
            @Valid @RequestBody com.nixtap.engagement.dto.request.OwnerAppointmentRequest req) {
        return ResponseEntity.ok(ApiResponse.success("Appointment updated", 
                engagementService.updateAppointment(cardId, apptId, req)));
    }

    @DeleteMapping("/appointments/{apptId}")
    @Operation(summary = "Delete an appointment")
    public ResponseEntity<ApiResponse<Void>> deleteAppointment(
            @PathVariable Long cardId,
            @PathVariable Long apptId) {
        engagementService.deleteAppointment(cardId, apptId);
        return ResponseEntity.ok(ApiResponse.success("Appointment deleted", null));
    }

    @GetMapping("/feedback")
    @Operation(summary = "Get feedback for my card")
    public ResponseEntity<ApiResponse<List<VisitorFeedbackResponse>>> getFeedback(
            @PathVariable Long cardId) {
        return ResponseEntity.ok(ApiResponse.success(engagementService.getFeedback(cardId)));
    }
}
