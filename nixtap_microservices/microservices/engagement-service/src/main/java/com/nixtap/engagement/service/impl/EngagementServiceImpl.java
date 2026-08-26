package com.nixtap.engagement.service.impl;

import com.nixtap.engagement.dto.request.*;
import com.nixtap.engagement.dto.response.*;
import com.nixtap.engagement.entity.*;
import com.nixtap.engagement.enums.AppointmentStatus;
import com.nixtap.engagement.exception.ResourceNotFoundException;
import com.nixtap.engagement.repository.*;
import com.nixtap.engagement.service.EngagementService;
import com.nixtap.engagement.util.HeaderUserContext;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EngagementServiceImpl implements EngagementService {

    private final LeadCaptureRepository leadRepo;
    private final AppointmentRepository apptRepo;
    private final VisitorFeedbackRepository feedbackRepo;
    
    private final RestTemplate restTemplate;
    private final HeaderUserContext userContext;
    
    private void verifyCardOwnership(Long cardId) {
        Long userId = userContext.getCurrentUserId();
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("X-User-Id", userId.toString());
            HttpEntity<String> entity = new HttpEntity<>(headers);
            ResponseEntity<String> res = restTemplate.exchange(
                    "http://card-service:8082/api/v1/cards/" + cardId, 
                    HttpMethod.GET, 
                    entity, 
                    String.class);
            if (!res.getStatusCode().is2xxSuccessful()) {
                throw new IllegalStateException("Not authorized or card not found");
            }
        } catch (Exception e) {
            throw new IllegalStateException("Not authorized to manage this card's engagements");
        }
    }

    @Override
    @Transactional
    public LeadCaptureResponse submitLead(Long cardId, LeadCaptureRequest req) {
        LeadCapture lead = LeadCapture.builder()
                .cardId(cardId)
                .visitorName(req.getVisitorName())
                .visitorEmail(req.getVisitorEmail())
                .visitorPhone(req.getVisitorPhone())
                .message(req.getMessage())
                .isDeleted(false)
                .build();
        return toLeadResponse(leadRepo.save(lead));
    }

    @Override
    @Transactional
    public AppointmentResponse bookAppointment(Long cardId, AppointmentRequest req) {
        Appointment appt = Appointment.builder()
                .cardId(cardId)
                .visitorName(req.getVisitorName())
                .visitorEmail(req.getVisitorEmail())
                .visitorPhone(req.getVisitorPhone())
                .requestedDatetime(req.getRequestedDatetime())
                .message(req.getMessage())
                .status(AppointmentStatus.PENDING)
                .isDeleted(false)
                .build();
        return toApptResponse(apptRepo.save(appt));
    }

    @Override
    @Transactional
    public VisitorFeedbackResponse submitFeedback(Long cardId, VisitorFeedbackRequest req) {
        VisitorFeedback fb = VisitorFeedback.builder()
                .cardId(cardId)
                .visitorName(req.getVisitorName())
                .rating(req.getRating())
                .comment(req.getComment())
                .imageUrl(req.getImageUrl())
                .isDeleted(false)
                .build();
        return toFeedbackResponse(feedbackRepo.save(fb));
    }

    @Override
    @Transactional(readOnly = true)
    public List<LeadCaptureResponse> getLeads(Long cardId) {
        verifyCardOwnership(cardId);
        return leadRepo.findByCardIdOrderByCreatedAtDesc(cardId)
                .stream().map(this::toLeadResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AppointmentResponse> getAppointments(Long cardId) {
        verifyCardOwnership(cardId);
        return apptRepo.findByCardIdOrderByRequestedDatetimeAsc(cardId)
                .stream().map(this::toApptResponse).collect(Collectors.toList());
    }

    // (updateAppointmentStatus removed)
    
    @Override
    @Transactional
    public AppointmentResponse createAppointment(Long cardId, OwnerAppointmentRequest req) {
        verifyCardOwnership(cardId);
        
        if (req.getVisitorName() == null || req.getVisitorName().trim().isEmpty()) {
            throw new IllegalArgumentException("Visitor name is required");
        }
        if (req.getRequestedDatetime() == null) {
            throw new IllegalArgumentException("Requested datetime is required");
        }
        
        Appointment appt = Appointment.builder()
                .cardId(cardId)
                .visitorName(req.getVisitorName())
                .visitorEmail(req.getVisitorEmail())
                .visitorPhone(req.getVisitorPhone())
                .requestedDatetime(req.getRequestedDatetime())
                .message(req.getMessage())
                .status(req.getStatus() != null ? req.getStatus() : AppointmentStatus.PENDING)
                .isDeleted(false)
                .build();
        return toApptResponse(apptRepo.save(appt));
    }

    @Override
    @Transactional
    public AppointmentResponse updateAppointment(Long cardId, Long apptId, OwnerAppointmentRequest req) {
        verifyCardOwnership(cardId);
        Appointment appt = apptRepo.findByIdAndCardId(apptId, cardId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment", "id", apptId));
        
        if (req.getVisitorName() != null) appt.setVisitorName(req.getVisitorName());
        if (req.getVisitorEmail() != null) appt.setVisitorEmail(req.getVisitorEmail());
        if (req.getVisitorPhone() != null) appt.setVisitorPhone(req.getVisitorPhone());
        if (req.getRequestedDatetime() != null) appt.setRequestedDatetime(req.getRequestedDatetime());
        if (req.getMessage() != null) appt.setMessage(req.getMessage());
        if (req.getStatus() != null) appt.setStatus(req.getStatus());
        
        return toApptResponse(apptRepo.save(appt));
    }

    @Override
    @Transactional
    public void deleteAppointment(Long cardId, Long apptId) {
        verifyCardOwnership(cardId);
        Appointment appt = apptRepo.findByIdAndCardId(apptId, cardId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment", "id", apptId));
        appt.setIsDeleted(true);
        apptRepo.save(appt);
    }

    @Override
    @Transactional(readOnly = true)
    public List<VisitorFeedbackResponse> getFeedback(Long cardId) {
        verifyCardOwnership(cardId);
        return feedbackRepo.findByCardIdOrderByCreatedAtDesc(cardId)
                .stream().map(this::toFeedbackResponse).collect(Collectors.toList());
    }

    private LeadCaptureResponse toLeadResponse(LeadCapture l) {
        return LeadCaptureResponse.builder()
                .id(l.getId()).cardId(l.getCardId())
                .visitorName(l.getVisitorName()).visitorEmail(l.getVisitorEmail())
                .visitorPhone(l.getVisitorPhone()).message(l.getMessage())
                .createdAt(l.getCreatedAt()).build();
    }

    private AppointmentResponse toApptResponse(Appointment a) {
        return AppointmentResponse.builder()
                .id(a.getId()).cardId(a.getCardId())
                .visitorName(a.getVisitorName()).visitorEmail(a.getVisitorEmail())
                .visitorPhone(a.getVisitorPhone()).requestedDatetime(a.getRequestedDatetime())
                .message(a.getMessage()).status(a.getStatus())
                .createdAt(a.getCreatedAt()).updatedAt(a.getUpdatedAt()).build();
    }

    private VisitorFeedbackResponse toFeedbackResponse(VisitorFeedback f) {
        return VisitorFeedbackResponse.builder()
                .id(f.getId()).cardId(f.getCardId())
                .visitorName(f.getVisitorName()).rating(f.getRating())
                .comment(f.getComment()).imageUrl(f.getImageUrl()).createdAt(f.getCreatedAt()).build();
    }
}
