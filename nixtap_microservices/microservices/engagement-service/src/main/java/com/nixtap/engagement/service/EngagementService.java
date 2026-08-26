package com.nixtap.engagement.service;
import com.nixtap.engagement.dto.request.*;
import com.nixtap.engagement.dto.response.*;
import com.nixtap.engagement.enums.AppointmentStatus;
import java.util.List;

public interface EngagementService {
    // Public — visitor submits
    LeadCaptureResponse submitLead(Long cardId, LeadCaptureRequest request);
    AppointmentResponse bookAppointment(Long cardId, AppointmentRequest request);
    VisitorFeedbackResponse submitFeedback(Long cardId, VisitorFeedbackRequest request);

    // Owner — views and manages
    List<LeadCaptureResponse> getLeads(Long cardId);
    List<AppointmentResponse> getAppointments(Long cardId);
    // (updateAppointmentStatus replaced by full/partial updateAppointment)
    
    AppointmentResponse createAppointment(Long cardId, OwnerAppointmentRequest request);
    AppointmentResponse updateAppointment(Long cardId, Long apptId, OwnerAppointmentRequest request);
    void deleteAppointment(Long cardId, Long apptId);
    
    List<VisitorFeedbackResponse> getFeedback(Long cardId);
}
